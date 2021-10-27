import React, { useState } from "react";
import { Text, Flex, IconButton, Box, Heading, Link } from "@chakra-ui/react"
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";
import NextLink from "next/link";
import { useRouter } from "next/router";

interface SinglePostProps {
  post: PostSnippetFragment
}

const SinglePost: React.FC<SinglePostProps> = ({post}) => {
  const [loadingState, setLoadingState] = useState<"updoot-loading" | "downdoot-loading" | "not-loading">("not-loading")
  const [, vote] = useVoteMutation();
  const router = useRouter();

  return (
    <>
      <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
        <Flex direction="column" justifyContent="center" alignItems="center" mr={10}>
          <IconButton
            aria-label="updoot"
            icon={<ArrowUpIcon w={25} h={25} />}
            onClick={async () => {
              if (post.voteStatus === 1) {
                return;
              }
              setLoadingState('updoot-loading');
              await vote({
                postId: post.id,
                value: 1
              });
              setLoadingState('not-loading')
            }}
            color={post.voteStatus === 1 ? "tomato" : undefined}
            isLoading={loadingState === "updoot-loading"}
          />
          <Text fontSize="18px">{post.points}</Text>
          <IconButton
            aria-label="downdoot"
            icon={<ArrowDownIcon w={25} h={25} />}
            onClick={async () => {
              if (post.voteStatus === -1) {
                return;
              }
              setLoadingState('downdoot-loading');
              await vote({
                postId: post.id,
                value: -1
              });
              setLoadingState('not-loading')
            }}
            color={post.voteStatus === -1 ? "blue" : undefined}
            isLoading={loadingState === "downdoot-loading"}
          />
        </Flex>
        <Box>
          {router.route === "/" ? (
            <NextLink href="/post/[id]" as={`/post/${post.id}`}>
              <Link>
                <Heading fontSize="xl">{post.postTitle}</Heading>
              </Link>
            </NextLink>
          ) : (
            <Heading fontSize="xl">{post.postTitle}</Heading>
          )}
          <Text mt={4} style={{wordBreak: "break-word"}}>{post.textSnippet}</Text>
          <Text>By {post.creator.username}</Text>
        </Box>
      </Flex>
    </>
  )
}

export default SinglePost;