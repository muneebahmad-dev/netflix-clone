import Image from 'next/image'
import React from 'react'
import { BASE_URL } from '../constants/movie'
import { Movie } from '../typings'

interface Props {
  movie: Movie
}

const Thumbnails = ({ movie }: Props) => {
  return (
    <div className="relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:h-36 md:min-w-[260px] md:hover:scale-x-105">
      <Image
        alt="thumbnail"
        src={`${BASE_URL}${movie?.backdrop_path || movie?.poster_path}`}
        className="rounded-sm object-cover md:rounded"
        layout="fill"
      />
    </div>
  )
}

export default Thumbnails
