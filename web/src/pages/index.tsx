import NavBar from "../components/NavBar";
import { withUrqlClient } from 'next-urql';
import createUrqlClient from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Spinner } from "@chakra-ui/react"

const Index = () => {
  const [{data}] = usePostsQuery();
  return (
    <>
      <NavBar />
      {!data ? (<Spinner />) : (data.posts.map((p) => <div key={p.id}>{p.title}</div>))}
    </>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: false })(Index);