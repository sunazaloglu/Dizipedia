import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

interface MovieCardProps {
  id: number;
  name: string;
  image?: string | null;
  language?: string | null;
  rating?: number | null;
}

function MovieCard({ id, name, image, language, rating }: MovieCardProps) {
  return (
    <Link
      to={`/shows/${id}`}
      style={{ textDecoration: "none", color: " inherit" }}
    >
      <Card className="h-100">
        {image ? (
          <Card.Img variant="top" src={image} alt={name} />
        ) : (
          <div
            style={{
              height: 225,
              background: "#f4f4f4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            No Image
          </div>
        )}
        <Card.Body>
          <Card.Title className="fs-6">{name}</Card.Title>
          <Card.Title className="text-muted small mb-1">
            {" "}
            Language: {language ?? "Unknown"}
          </Card.Title>
          <Card.Title className="text-muted small">IMDB: {rating ?? "-"}</Card.Title>
        </Card.Body>
      </Card>
    </Link>
  );
}

export default MovieCard;
