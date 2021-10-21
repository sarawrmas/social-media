import { Arg, Ctx, Field, Mutation, ObjectType, Resolver, Query } from "type-graphql";
import { User } from "../entities/User";
import { MyContext } from "../types";
import argon2 from 'argon2';
import { EntityManager } from "@mikro-orm/postgresql";
import { COOKIE_NAME } from "../constants";
import { UserInput } from "./UserInput";
import { validateRegister } from "../utils/validateRegister";

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[];

  @Field(() => User, {nullable: true})
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, {nullable: true})
  async me(
    @Ctx() { req, em }: MyContext
  ) {
    // you are not logged in
    if (!req.session.userId) {
      return null
    }
    const user = await em.findOne(User, {id: req.session.userId});
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UserInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password);
    let user;
    
    try {
      const result = await (em as EntityManager).createQueryBuilder(User).getKnexQuery().insert(
        {
          email: options.email,
          username: options.username,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date()
        }
      ).returning("*");
      user = result[0];
    } catch (err) {
      if (err.code === "23505") {
        // duplicate username error
        return {
          errors: [
            {
              field: "username",
              message: "Username already taken"
            }
          ]
        }
      }
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User,
      usernameOrEmail.includes('@') ?
      { email: usernameOrEmail } :
      { username: usernameOrEmail }
    );
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "User does not exist"
          }
        ]
      }
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password"
          }
        ]
      }
    }

    req.session.userId = user.id;

    console.log(req.session)

    return { user };
  }

  @Mutation(() => Boolean)
  logout(
    @Ctx() { req, res }: MyContext
  ) {
    return new Promise(resolve => req.session.destroy(err => {
      if (err) {
        console.log(err);
        resolve(false)
        return 
      }
      res.clearCookie(COOKIE_NAME)
      resolve(true)
    }))
  }

  // @Mutation(() => Boolean)
  // async forgotPassword(
  //   @Arg('email') email: string,
  //   @Ctx() { em }: MyContext
  // ) {
  //   // const user = await em.findOne(User, { email })
  //   return true;
  // }
}