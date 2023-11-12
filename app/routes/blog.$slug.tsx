import React, { useMemo } from 'react'
// import { invariant } from 'outvariant'
import * as mdxBundler from 'mdx-bundler/client/index.js'
import { motion } from 'framer-motion'
import {
  SiTwitter as TwitterIcon,
  SiGithub as GitHubIcon,
} from 'react-icons/si'
import {
  getPostContent,
  getRecommendedPosts,
} from '~/lib/blog.server'
import { Container, Grid } from '../components/grid'
import { mdxComponents } from '../components/mdx'
import { PostThumbnail } from '../components/postThumbnail'
// import { getOrigin } from '../utils/getOrigin'
import { formatDate } from '../lib/utils/date'
import { PostTitle } from '../components/post/postTitle'
import { PostMeta } from '../components/post/postMeta'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export async function loader({ params }: { params: { slug: string } }) {
  const post = await getPostContent(params.slug)
  const recommendedPosts = await getRecommendedPosts(post, 3)

  return json({ post, recommendedPosts })
}

export default function BlogPost(): JSX.Element {
  const { post, recommendedPosts } = useLoaderData<typeof loader>()

  const Component = useMemo(() => mdxBundler.getMDXComponent(post.code), [post.code])

  console.log({post})

  const publishedAt = formatDate(post.frontmatter.date)

  return (
    <>
      <div className="from-white to-gray-100 bg-gradient-to-t">
        <Container className="mb-20 lg:pt-10">
          <div className="relative max-w-3xl mx-auto">
            <div className="hidden lg:block pattern -left-16 -translate-x-full bottom-[25%] opacity-20 w-[300px]" />
            <div className="hidden lg:block pattern -right-16 translate-x-full bottom-[25%] opacity-20 w-[300px]" />
            <motion.div
              initial={{ y: -50, opacity: 0, filter: 'grayscale(100%)' }}
              animate={{ y: 0, opacity: 1, filter: 'grayscale(0%)' }}
              transition={{ duration: 0.8 }}
            >
              <div
                className="w-48 mx-auto pb-5 lg:pb-10 drop-shadow-2xl"
                dangerouslySetInnerHTML={{ __html: post.thumbnailSvg }}
              />
            </motion.div>
            <motion.header
              className="text-center text-xl"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.25 }}
            >
              <PostMeta
                category={post.frontmatter.category}
                publishedAt={publishedAt}
              />
              <PostTitle title={post.frontmatter.title} />

              <div className="inline-grid grid-cols-[2fr_1fr_auto_1fr_2fr] items-center gap-5 text-gray-500 mt-16 font-medium text-2xl">
                <hr className="border border-gray-200" />
                <a
                  href="https://twitter.com/kettanaito"
                  rel="noreferrer"
                  target="_blank"
                  className="p-5 hover:text-black"
                >
                  <TwitterIcon />
                </a>
                <img
                  src="https://github.com/kettanaito.png"
                  alt="kettanaito's avatar"
                  className="h-12 w-12 rounded-full shadow-lg"
                />
                <a
                  href="https://github.com/kettanaito"
                  rel="noreferrer"
                  target="_blank"
                  className="p-5 hover:text-black"
                >
                  <GitHubIcon />
                </a>
                <hr className="border border-gray-200" />
              </div>
            </motion.header>
          </div>
        </Container>
      </div>
      <motion.div
        className="text-lg mb-20 lg:mb-[7.5rem]"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <Container className="relative">         
          <main className="post-content max-w-3xl mx-auto">
            <Component components={mdxComponents} />
          </main>
        </Container>
      </motion.div>

      <aside className="py-4 bg-gray-50 border-t border-b text-center font-medium">
        <Container>
          <p>
            Liked my writing?{' '}
            <a
              href="https://www.buymeacoffee.com/kettanaito"
              target="_blank"
              rel="noreferrer"
              className="text-gray-500 hover:underline hover:text-black"
            >
              Buy me a ☕️ coffee
            </a>
            !
          </p>
        </Container>
      </aside>

      {recommendedPosts?.length ? (
        <section className="my-20">
          <Container>
            <h2>Keep on reading</h2>
            <Grid className="my-10 gap-y-20">
              {recommendedPosts.map((post) => {
                return (
                  <PostThumbnail
                    key={post.slug}
                    url={post.url}
                    title={post.frontmatter.title}
                    category={post.frontmatter.category}
                    date={new Date(post.frontmatter.date)}
                    thumbnailSvg={post.thumbnailSvg}
                    className="w-full col-span-2"
                  />
                )
              })}
            </Grid>
          </Container>
        </section>
      ) : null}
    </>
  )
}
