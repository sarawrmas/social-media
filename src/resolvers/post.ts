import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { Post } from '../entities/Post';
import { MyContext } from '../types';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    // return all posts
    return em.find(Post, {});
  }

  @Query(() => Post, {nullable: true})
  post(
    @Arg('id', () => Number) id: number,
    @Ctx() { em }: MyContext): Promise<Post | null> {
    // return all posts
    return em.findOne(Post, { id });
  }
}