import { useEffect, useState } from 'react'
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import styled from 'styled-components'
import { searchBook, fetchBooks } from '../../api/books/bookApi'
import Pagination from '../../components/common/Pagination'
import useCustomMove from '../../hooks/useCustomMove'
import NoContent from '../../components/common/NoContent'

const initData = [
  {
    id: 1,
    title: '어린왕자의 철학',
    author: '정철',
    publisher: '철학의숲',
    img: 'https://picsum.photos/seed/1/200/280',
  },
  {
    id: 2,
    title: '다시 만난 어린왕자',
    author: '김민정',
    publisher: '문학사랑',
    img: 'https://picsum.photos/seed/2/200/280',
  },
  {
    id: 3,
    title: '어린왕자와 함께하는 하루',
    author: '이준',
    publisher: '하루북스',
    img: 'https://picsum.photos/seed/3/200/280',
  },
  {
    id: 4,
    title: '어린왕자의 편지',
    author: '송지현',
    publisher: '편지출판',
    img: 'https://picsum.photos/seed/4/200/280',
  },
  {
    id: 5,
    title: '어린왕자와 떠나는 여행',
    author: '홍길동',
    publisher: '여행의길',
    img: 'https://picsum.photos/seed/5/200/280',
  },
  {
    id: 6,
    title: '어린왕자의 지구일기',
    author: '박은영',
    publisher: '별책출판',
    img: 'https://picsum.photos/seed/6/200/280',
  },
  {
    id: 7,
    title: '어린왕자 그리고 장미',
    author: '최성훈',
    publisher: '플로라북스',
    img: 'https://picsum.photos/seed/7/200/280',
  },
  {
    id: 8,
    title: '어린왕자, 별을 걷다',
    author: '이아름',
    publisher: '은하수출판사',
    img: 'https://picsum.photos/seed/8/200/280',
  },
]

const ArticleContainer = styled.article`
  margin-top: 48px;
  .title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 2rem;
  }

  .highlight {
    color: #2563eb;
  }
`

const BookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 48px 96px;
`

const BookCard = styled.div`
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.1s;
  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
    transform: translate(1px, 1px);
  }

  img {
    width: 100%;
    height: auto;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 12px;
  }

  h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 6px;
  }

  p {
    font-size: 0.875rem;
    color: #555;
  }
`

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')
  const keyword = searchParams.get('keyword')
  const page = parseInt(searchParams.get('page')) || 1
  const size = parseInt(searchParams.get('size')) || 10
  const { moveToList, moveToRead } = useCustomMove()

  // const [books, setBooks] = useState([])
  const [serverData, setServerData] = useState({ books: [] })

  useEffect(() => {
    const realKeyword = keyword ?? ''
    const params = { type: type ?? '', keyword: realKeyword, page: page - 1, size }
    searchBook(params).then((data) => {
      setServerData({
        books: data.books || [],
        page: (data.page ?? 0) + 1, // 0부터 시작하므로 1부터 시작하도록 변환
        size: data.size,
        totalCount: data.totalCount,
        totalPages: data.totalPages,
      })
    })
  }, [type, keyword, page, size])

  useEffect(() => {
    // console.log('북스=', serverData.books)
  }, [serverData])

  const navigate = useNavigate()
  const queryString = createSearchParams({ page, size }).toString()

  if (serverData.books.length < 1)
    return (
      <ArticleContainer>
        <NoContent msg={`${keyword} 키워드로 검색된 도서가 없습니다.`} />
      </ArticleContainer>
    )
  return (
    <ArticleContainer>
      <BookGrid>
        {serverData.books.map((book) => (
          <BookCard
            key={book.bookId}
            onClick={() =>
              navigate({
                pathname: `../${book.bookId}`,
                search: queryString,
              })
            }
          >
            <img src={book.cover} alt={book.title} />
            <h3>{book.title}</h3>
            <p>
              {book.author} | {book.publisher}
            </p>
          </BookCard>
        ))}
      </BookGrid>

      <Pagination serverData={serverData} movePage={moveToList} />
    </ArticleContainer>
  )
}

export default SearchPage
