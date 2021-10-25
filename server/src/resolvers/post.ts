import { isAuth } from "../middleware/isAuth";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, FieldResolver, InputType, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { Post } from "../entities/Post";
import { getConnection } from "typeorm";

@InputType()
class PostInput {
  @Field()
  postTitle: string
  @Field()
  postBody: string
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    const maxLength = 100
    const trimmedString = root.postBody.substr(0, maxLength);
    return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))) + "..."
    // return root.postBody.slice(0, 100)
  }

  @Query(() => [Post])
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<Post[]> {
    // pagination logic
    const realLimit = Math.min(50, limit);
    const qb = getConnection()
    .getRepository(Post)
    .createQueryBuilder("post")
    .orderBy('"createdAt"', "DESC")
    .take(realLimit)

    if (cursor) {
      qb.where('"createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) })
    }

    return qb.getMany()
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