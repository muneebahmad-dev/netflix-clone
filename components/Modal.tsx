import {
  CheckIcon,
  PlusIcon,
  ThumbUpIcon,
  VolumeOffIcon,
  VolumeUpIcon,
  XIcon,
} from '@heroicons/react/outline'
import MaterialModal from '@mui/material/Modal'
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { FaPlay } from 'react-icons/fa'
import ReactPlayer from 'react-player'
import { useRecoilState } from 'recoil'
import toast, { Toaster } from 'react-hot-toast'
import { modalState, movieState } from '../atoms/modalAtom'
import { db } from '../fireabse'
import useAuth from '../hooks/useAuth'
import { Element, Genre, Movie } from '../typings'

const Modal = () => {
  const [showModal, setShowModal] = useRecoilState(modalState)
  const [movie, setMovie] = useRecoilState(movieState)
  const [trailer, setTrailer] = useState('')
  const [muted, setMuted] = useState(false)
  const [addedToList, setAddedToList] = useState(false)
  const [movies, setMovies] = useState<DocumentData[] | Movie[]>([])

  const [genres, setGenres] = useState<Genre[]>([])

  const { user } = useAuth()

  const toastStyle = {
    background: 'white',
    color: 'black',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '15px',
    borderRadius: '9999px',
    maxWidth: '1000px',
  }

  const fetchMovies = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/${
        movie?.media_type === 'tv' ? 'tv' : 'movie'
      }/${movie?.id}?api_key=${
        process.env.NEXT_PUBLIC_API_KEY
      }&language=en-US&append_to_response=videos`
    )
      .then((response) => response?.json())
      .catch((err) => console.log(err.message))

    if (data?.videos) {
      const index = data?.videos?.results?.findIndex(
        (element: Element) => element?.type === 'Trailer'
      )
      setTrailer(data?.videos?.results?.[index]?.key)
    }
    if (data?.genres) {
      setGenres(data?.genres)
    }
  }

  useEffect(() => {
    if (user) {
      return onSnapshot(
        collection(db, 'customers', user.uid, 'myList'),
        (snapshot: any) => setMovies(snapshot.docs)
      )
    }
  }, [db, movie?.id])

  useEffect(
    () =>
      setAddedToList(
        movies.findIndex((result) => result.data().id === movie?.id) !== -1
      ),
    [movies]
  )

  useEffect(() => {
    if (!movie) return

    fetchMovies()
  }, [movie])

  const handleList = async () => {
    if (addedToList) {
      await deleteDoc(
        doc(db, 'customers', user!.uid, 'myList', movie?.id.toString()!)
      )

      toast(
        `${movie?.title || movie?.original_name} has been removed from My List`,
        {
          duration: 8000,
          style: toastStyle,
        }
      )
    } else {
      await setDoc(
        doc(db, 'customers', user!.uid, 'myList', movie?.id.toString()!),
        {
          ...movie,
        }
      )

      toast(
        `${movie?.title || movie?.original_name} has been added to My List.`,
        {
          duration: 8000,
          style: toastStyle,
        }
      )
    }
  }

  const handleClose = () => setShowModal(false)

  return (
    <MaterialModal
      open={showModal}
      onClose={handleClose}
      className="fixed !top-10 left-0 right-0 z-50 mx-auto w-full max-w-5xl items-center overflow-hidden  overflow-y-scroll rounded-md scrollbar-hide"
    >
      <>
        <Toaster position="bottom-center" />
        <button
          className="modalButton absolute top-5 right-5 z-40 h-9 w-9 border-none bg-[#181818]"
          onClick={handleClose}
        >
          <XIcon className="h-6 w-6" />
        </button>

        <div className="relative pt-[56.25%]">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${trailer}`}
            width="100%"
            height="100%"
            muted={muted}
            style={{ position: 'absolute', top: '0', left: '0' }}
            playing
          />
          <div className="absolute bottom-10 flex w-full items-center justify-between px-10">
            <div className="flex space-x-3">
              <button className="flex items-center gap-x-2 rounded bg-white px-10 py-2 text-black">
                <FaPlay className="h-7 w-7" />
                Play
              </button>
              <button className="modalButton" onClick={handleList}>
                {addedToList ? (
                  <CheckIcon className="h-7 w-7" />
                ) : (
                  <PlusIcon className="h-7 w-7" />
                )}
              </button>
              <button className="modalButton">
                <ThumbUpIcon className="h-7 w-7" />
              </button>
            </div>
            <button onClick={() => setMuted(!muted)} className="modalButton">
              {muted ? (
                <VolumeOffIcon className="h-6 w-6" />
              ) : (
                <VolumeUpIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        <div className=" rounded-b-md bg-[#181818] py-8 px-10">
          <div className="space-y-6 text-lg">
            <div className="flex items-center space-x-2 text-sm">
              <p className="font-semibold text-green-400">
                {movie?.vote_average * 10}% Match
              </p>
              <p className="font-light">
                {movie?.release_date || movie?.first_air_date}
              </p>
              <div className="flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs">
                HD
              </div>
            </div>
            <div className="flex flex-col gap-y-4 gap-x-10 font-light md:flex-row">
              <p className="w-5/6">{movie?.overview}</p>
              <div className="flex flex-col space-y-3 text-sm">
                <div>
                  <span className="text-[gray]">Genres: </span>
                  {genres?.map((genre) => genre.name).join(', ')}
                </div>
                <div>
                  <span className="text-[gray]">Original Language: </span>
                  {movie?.original_language}
                </div>
                <div>
                  <span className="text-[gray]">Total Votes: </span>
                  {movie?.vote_count}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </MaterialModal>
  )
}

export default Modal
