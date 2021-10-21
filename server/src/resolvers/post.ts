import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    // return all posts
    // await sleep(5000)
    return em.find(Post, {});
  }

  @Query(() => Post, {nullable: true})
  post(
    @Arg("id", () => Number) id: number,
    @Ctx() { em }: MyContext): Promise<Post | null> {
    // find post by id
    return em.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() { em }: MyContext): Promise<Post> {
    // create post
    const post = em.create(Post, {title})
    await em.persistAndFlush(post)
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext): Promise<Post | null> {
    // fetch post
    const post = await em.findOne(Post, {id});
    // handle error post not found
    if (!post) {
      return null;
    }
    // change post title
    if (typeof title !== 'undefined') {
      post.title = title;
      await em.persistAndFlush(post);
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext): Promise<boolean> {
    try {
      await em.nativeDelete(Post, {id});
      return true;
    } catch {
      return false;
    }
  }
}