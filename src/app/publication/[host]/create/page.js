import CreatePost from "@/app/components/blog/CreatePost"

const PublishPost = ({ params: { host } }) => {
  return <CreatePost host={host} />
}

export default PublishPost
