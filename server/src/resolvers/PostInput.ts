import { Field, InputType } from "type-graphql";


@InputType()
export class PostInput {
  @Field()
  postTitle: string;
  @Field()
  postBody: string;
}
