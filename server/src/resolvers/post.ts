import { isAuth } from "../middleware/isAuth";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, FieldResolver, Info, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { Post } from "../entities/Post";
import { getConnection } from "typeorm";
import { Updoot } from "../entities/Updoot";
import { PostInput } from "./PostInput";

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[]
  @Field()
  hasMore: boolean
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() post: Post) {
    return post.postBody.slice(0, 100);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const isUpdoot = value !== -1;
    const realValue = isUpdoot ? 1 : -1
    const userId = req.session.userId

    const updoot = await Updoot.findOne({where: {postId, userId} })

    // user has already voted on post and wants to change their vote
    if (updoot && updoot.value !== realValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(`
          UPDATE updoot
          SET value = $1
          WHERE "postId" = $2 and "userId" = $3
        `, [realValue, postId, userId]);
        await tm.query(`
          UPDATE post
          SET points = points + $1
          WHERE id = $2
        `, [2 * realValue, postId])
      });
    // has not voted on post and wants to vote
    } else if (!updoot) {
      await getConnection().transaction(async tm => {
        await tm.query(`
          INSERT INTO updoot ("userId", "postId", value)
          values ($1, $2, $3)
        `, [userId, postId, realValue]);
        await tm.query(`
          UPDATE post
          SET points = points + $1
          WHERE id = $2
        `, [realValue, postId])
      });
    }

    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedPosts> {
    // pagination logic
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;
    const userId = req.session.userId;

    const replacements: any[] = [realLimitPlusOne, userId];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const posts = await getConnection().query(`
      SELECT p.*,
      json_build_object(
        'id', u.id,
        'username', u.username,
        'email', u.email
      ) creator,
      ${
        userId
        ? `(SELECT value FROM updoot WHERE "userId" = $2 and "postId" = p.id) "voteStatus"`
        : `null as "voteStatus"`
      }
      FROM post p
      INNER JOIN public.user u ON u.id = p."creatorId"
      ${cursor ? `WHERE p."createdAt" < $3` : ``}
      ORDER BY p."createdAt" DESC
      LIMIT $1
    `, replacements)

    return { posts: posts.slice(0, realLimit), hasMore: posts.length === realLimitPlusOne }
  }

  @Query(() => Post, {nullable: true})
  post(
    @Arg("id") id: number): Promise<Post | undefined> {
    // find post by id
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    
    // create post
    return Post.create({
      ...input,
      creatorId: req.session.userId
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("postTitle", () => String, { nullable: true }) postTitle: string): Promise<Post | null> {
    // fetch post
    const post = await Post.findOne(id);
    // handle error post not found
    if (!post) {
      return null;
    }
    // change post title
    if (typeof postTitle !== 'undefined') {
      post.postTitle = postTitle;
      Post.update({id}, {postTitle});
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}