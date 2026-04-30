import { HTMLAttributes } from 'react'

export function Skeleton({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`skeleton rounded-lg ${className}`}
      {...props}
    />
  )
}
