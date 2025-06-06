import React from 'react'
import css from '@/styles/Home.module.css'
import PostGenerator from '@/components/Post/PostGenerator'

const HomeView = () => {
  return (
    <div className={css.wrapper}>
        <div className={css.postsArea}>
            <PostGenerator/>
            <span>post</span>
        </div>
        <div className={css.right}>
            <span>Trending Sections</span>
            <span>Follow Suggestions</span>
        </div>
    </div>
  )
}

export default HomeView