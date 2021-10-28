import React, { useState } from "react";
import { Text, Flex, IconButton, Box, Heading, Link } from "@chakra-ui/react"
import { ArrowUpIcon, ArrowDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { PostSnippetFragment, useDeletePostMutation, useMeQuery, useVoteMutation } from "../generated/graphql";
import NextLink from "next/link";
import { useRouter } from "next/router";

interface SinglePostProps {
  post: PostSnippetFragment
}

const SinglePost: React.FC<SinglePostProps> = ({post}) => {
  const [loadingState, setLoadingState] = useState<"updoot-loading" | "downdoot-loading" | "not-loading">("not-loading")
  const [, vote] = useVoteMutation();
  const router = useRouter();
  const [, deletePost] = useDeletePostMutation();
  const [{data: meData}] = useMeQuery();

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
        <Box flex={1}>
          {router.route === "/" ? (
            <NextLink href="/post/[id]" as={`/post/${post.id}`}>
              <Link>
                <Heading fontSize="xl">{post.postTitle}</Heading>
              </Link>
            </NextLink>
          ) : (
            <Heading fontSize="xl">{post.postTitle}</Heading>
          )}
          {meData?.me?.id !== post.creator.id ? null : (
          <Flex>
            <Text flex={1} mt={4} style={{wordBreak: "break-word"}}>{post.textSnippet}</Text>
            <Flex direction="column" justifyContent="space-around">
              <NextLink href="/post/edit/[id]" as={`/post/edit/${post.id}`}>
                <IconButton
                  aria-label="edit post"
                  icon={<EditIcon mb={20} />}
                  ml="auto"
                  color="blue"
                />
              </NextLink>
              <IconButton
                aria-label="delete post"
                icon={<DeleteIcon />}
                onClick={() => {
                  deletePost({ id: post.id })
                }}
                ml="auto"
                color="tomato"
              />
            </Flex>
          </Flex>
          )}
          <Text>By {post.creator.username}</Text>
        </Box>
      </Flex>
    </>
  )
}

export default SinglePost;