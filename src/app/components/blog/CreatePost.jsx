"use client"
import React, { useState } from "react"
import { useHashnodePublishPost } from "hashnode-client"
import { useRouter } from "next/navigation"

const dataPayload = {
  settings: {
    personalAccessToken: process.env.NEXT_PUBLIC_PERSONAL_ACCESS_TOKEN,
    host: process.env.NEXT_PUBLIC_HOST_URL,
  },
}

const CreatePost = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { publish } = useHashnodePublishPost(dataPayload.settings)
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    contentMarkdown: "",
    slug: "",
    tags: "",
    disableComments: false,
    coverImageOptions: {},
    tags: [],
    coAuthors: [],
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === "checkbox" ? checked : value
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }))
  }

  const handleClick = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const finalDataPayload = {
      first: 10,
      after: null,
      input: {
        ...formData,
        publishedAt: new Date().toISOString(),
      },
    }

    try {
      //Call API
      const response = await publish(finalDataPayload)

      // Handle response
      if (!response.error && response.post?.id) {
        alert("Post published successfully")
        router.push(`/publication/${dataPayload.settings.host}/`)
      } else {
        throw new Error(
          response.error?.message || "Error while publishing post"
        )
      }
    } catch (error) {
      console.log("🚀 ~ handleClick ~ error:", error)
      alert("Error while publishing post")
    }
    setIsLoading(false)
  }

  return (
    <div className="text-center flex-col">
      <h1 className="m-10 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        Add New Post
      </h1>
      <form style={{ width: "50%", margin: "0 auto" }}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter title"
            onChange={handleChange}
            name="title"
            value={formData.title}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="subtitle"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Subtitle
          </label>
          <input
            type="text"
            id="subtitle"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter subtitle"
            onChange={handleChange}
            name="subtitle"
            value={formData.subtitle}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="contentMarkdown"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Content Markdown
          </label>
          <textarea
            id="contentMarkdown"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter content in markdown"
            onChange={handleChange}
            name="contentMarkdown"
            value={formData.contentMarkdown}
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            htmlFor="slug"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Slug
          </label>
          <input
            type="text"
            id="slug"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter slug"
            onChange={handleChange}
            name="slug"
            value={formData.slug}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="disableComments"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Disable Comments
          </label>
          <input
            type="checkbox"
            id="disableComments"
            className="mr-2 leading-tight"
            onChange={handleChange}
            name="disableComments"
            checked={formData.disableComments}
          />
        </div>

        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-5 rounded ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleClick}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Publish post"}
        </button>
      </form>
    </div>
  )
}

export default CreatePost
