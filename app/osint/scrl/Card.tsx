import * as React from "react"
import styles from "./Card.module.scss"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  title?: string | any
  mode?: string | any
}

const Card: React.FC<CardProps> = ({ children, mode, title, ...rest }) => {
  let titleElement = (
    <header className={styles.action}>
      <div className={styles.left} aria-hidden="true"></div>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.right} aria-hidden="true"></div>
    </header>
  )

  if (mode === "left") {
    titleElement = (
      <header className={styles.action}>
        <div className={styles.leftCorner} aria-hidden="true"></div>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.right} aria-hidden="true"></div>
      </header>
    )
  }

  if (mode === "right") {
    titleElement = (
      <header className={styles.action}>
        <div className={styles.left} aria-hidden="true"></div>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.rightCorner} aria-hidden="true"></div>
      </header>
    )
  }

  return (
    <article className={styles.card} {...rest}>
      {titleElement}
      <section className={styles.children}>{children}</section>
    </article>
  )
}

export default Card