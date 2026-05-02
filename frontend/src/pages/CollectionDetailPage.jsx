import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const CollectionDetailPage = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/shop?category=${collectionId}`, { replace: true });
  }, [collectionId, navigate]);

  return null;
};
