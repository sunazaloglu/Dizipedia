import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getShowDetailWithEmbeds, type ShowWithEmbeds } from "../../services/api";
import { Container, Row, Col, Button, Card, ListGroup, Spinner, Alert } from "react-bootstrap";

function ShowDetail() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ShowWithEmbeds | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const detail = await getShowDetailWithEmbeds(Number(id));
        if (cancelled) return;
        setData(detail);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="text-center p-3"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="p-3">{error}</Alert>;
  if (!data) return <div className="p-3">Cannot Found...</div>;

  return (
    <Container className="my-3">
      <Button variant="secondary" className="mb-3" onClick={() => window.history.back()}>
        🡐 Last Page
      </Button>

      <Row className="g-3">
        <Col xs={12} md={4}>
          {data.image?.original ? (
            <Card.Img src={data.image.original} alt={data.name} />
          ) : (
            <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 300 }}>
              No Image
            </div>
          )}
        </Col>

        <Col xs={12} md={8}>
          <h1>{data.name}</h1>
          <p className="text-muted mb-1">Status: {data.status ?? "Unknown"}</p>
          <p className="text-muted mb-1">Language: {data.language ?? "Unknown"}</p>
          <p className="text-muted mb-1">IMDB: {data.rating?.average ?? "-"}</p>

          {/* Api dan ne gelcegini bilemedigimiz icin html icerigini guvenli sekilde render edebilmek icin yazdim. */}
          <div dangerouslySetInnerHTML={{ __html: data.summary ?? "" }} />
          
        </Col>
      </Row> 

      {/* Seasons */}
      <h3 className="mt-4">Seasons</h3>
      <ListGroup>
        {(data._embedded?.seasons ?? []).map((s) => (
          <ListGroup.Item key={s.id}>
            SEASON {s.number ?? "?"} ({s.episodeOrder ?? "?"})
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Episodes */}
      <h3 className="mt-4">Episodes</h3>
      <Row xs={1} md={2} className="g-2">
        {(data._embedded?.episodes ?? []).map((e) => (
          <Col key={e.id}>
            <Card>
              <Card.Body>
                <Card.Text className="mb-0">
                  S{String(e.season).padStart(2, "0")}E{String(e.number).padStart(2, "0")} - {e.name}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ShowDetail;
