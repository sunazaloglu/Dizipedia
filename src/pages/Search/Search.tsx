import { useSearchParams} from "react-router-dom";
import { calculateNewPage, Paginate } from "../../utils/Paginate";
import { useEffect, useMemo, useState } from "react";
import { searchShows, type SearchResult, type Show } from "../../services/api";
import {
  Row,
  Col,
  Pagination,
  Form,
  Button,
  Container,
  Spinner,
  Alert,
} from "react-bootstrap";
import MovieCard from "../../components/MovieCard";

function Search() {
  const [params, setParams] = useSearchParams();
  const q = useMemo(() => params.get("q") ?? "", [params]);
  //urldeki q parametresini aldik ve q degiskenine atadik
  //dependency olarak da params i girdik ki params degismedigi surece
  //bir onceki aramayi kullansin
  const [page, setPage] = useState<number>(Number(params.get("page") ?? 1));
  const [results, setResults] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { totalPages, pageItems } = Paginate(results, page, 30);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!q) return;
      setLoading(true);
      setError(null);
      try {
        const list: SearchResult[] = await searchShows(q);
        if (cancelled) return;
        setResults(list.map((r) => r.show));
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [q]);

  //page degistiginde url guncellenir
  //sayfa yenilendiginde aktif sayfa korunur
  useEffect(() => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(page));
      return next;
    });
  }, [page, setParams]);

  //sayfa degistirme
  function goToPage(newPage: number) {
    //sayfa sinirlarini kontrol ediyor
    setPage(calculateNewPage(newPage, totalPages, 0));
  }

  return (
    <Container className="my-3">
      <h2>Search Results: "{q}"</h2>

      <Form className="d-flex mb-3" onSubmit={(e) => e.preventDefault()}>
        <Form.Control
          type="text"
          placeholder="Search for TV series..."
          value={q}
          onChange={(e) => setParams({ q: e.target.value })}
        />
        <Button type="submit" variant="outline-dark" className="ms-2">
          Search
        </Button>
      </Form>

      {loading && (
        <div className="text-center py-3">
          <Spinner animation="border" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row xs={2} sm={3} md={4} lg={5} className="g-3">
        {pageItems.map((show) => (
          <Col key={show.id}>
            <MovieCard
              id={show.id}
              name={show.name}
              image={show.image?.medium ?? null}
              language={show.language}
              rating={show.rating?.average}
            />
          </Col>
        ))}
      </Row>

      <Pagination className="justify-content-center mt-3">
        <Pagination.Prev
          disabled={page === 1}
          onClick={() => goToPage(page - 1)}
        />
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === page}
            onClick={() => goToPage(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={page === totalPages}
          onClick={() => goToPage(page + 1)}
        />
      </Pagination>
    </Container>
  );
}

export default Search;
