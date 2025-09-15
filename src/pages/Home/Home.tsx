import React, { useEffect, useMemo, useState } from "react";
import {
  getShowForLanding,
  searchShows,
  type SearchResult,
  type Show,
} from "../../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Paginate, calculateNewPage } from "../../utils/Paginate";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import Pagination from "../../components/Pagination"; // kendi pagination componentin
import MovieCard from "../../components/MovieCard";

function useQueryParam(name: string): string {
  // useSearchParams ile url parametrelerini aliyor sonra da memoya kaydediyor
  // sadece params i almak istedigim icin array parantezinde
  const [params] = useSearchParams();
  return useMemo(() => params.get(name) ?? "", [params, name]);
  //gereksiz renderdan kacinmak sart
}

function Home() {
  const navigate = useNavigate();
  const initialQuery = useQueryParam("q");
  // urldeki q parametresini alip initialquery ye atiyoruz
  // search?q=friends => useQueryParam("q") => "friends" gibisinden
  const [query, setQuery] = useState<string>(initialQuery);
  const [allShows, setAllShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  const { totalPages, pageItems } = Paginate(allShows, page, 30);
  //hangi veriyi sayfalicaz , hangi sayfayi istiyoruz , bir sayfada kac dizi olucak.

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (initialQuery) {
          //arama query varsa ilgili dizileri cek
          const results: SearchResult[] = await searchShows(initialQuery);
          if (cancelled) return;
          setAllShows(results.map((result) => result.show));
        } else {
          //yoksa 250 diziyi getir
          const allShowData = await getShowForLanding(250);
          if (cancelled) return;
          console.log("API den gelen dizi sayisi:", allShowData.length);
          // bunu yazmamin sebebi api da 250 dizi var ama listeledigimde 240 tane dizi geliyor.
          setAllShows(allShowData);
        }
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    //cleanup component unmount olursa iptal et
    return () => {
      cancelled = true;
    };
  }, [initialQuery]);

  //sayfayi degistirdigimde sayfanin usstten baslamasini istiyorum
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  function goToPage(delta: number) {
    const newPage = calculateNewPage(page, totalPages, delta);
    setPage(newPage);
  }

  //arama terimi varsa search sayfasina yonlendiriyor
  //yoksa ana sayfaya doner
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/");
    }
  }

  return (
    <Container className="bg-light p-3 rounded" style={{ maxWidth: 900 }}>
      {/* Search form */}
      <Form className="d-flex mb-3" onSubmit={onSubmit}>
        <Form.Control
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for TV series..."
        />
        <Button type="submit" variant="outline-dark" className="ms-2">
          Search
        </Button>
      </Form>

      {/* Loading / Error */}
      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
          <div>Loading...</div>
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Grid of shows */}
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

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={goToPage}
          totalItems={allShows.length}
        />
      </div>
    </Container>
  );
}

export default Home;
