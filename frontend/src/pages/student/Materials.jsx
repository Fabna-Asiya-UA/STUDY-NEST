import { useEffect, useState } from "react";
import "./Materials.css";
import api from "../../services/api";
import MaterialCard from "../../components/MaterialCard";
import Loader from "../../components/Loader";

function Materials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await api.get("/materials");

        setMaterials(
          response.data.materials || []
        );
      } catch (error) {
        console.error(
          "FETCH MATERIALS ERROR:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load study materials"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="materials-page">

      <div className="materials-header">

        <div>
          <h1>Study Materials</h1>

          <p>
            Access study materials uploaded
            by your teacher.
          </p>
        </div>

      </div>


      {error && (
        <p className="materials-error">
          {error}
        </p>
      )}


      {materials.length === 0 ? (

        <div className="materials-empty">

          <div>
            📚
          </div>

          <h2>
            No Materials Available
          </h2>

          <p>
            Your teacher has not uploaded
            any study materials yet.
          </p>

        </div>

      ) : (

        <div className="grid">

          {materials.map((material) => (
            <MaterialCard
              key={material._id}
              material={material}
            />
          ))}

        </div>

      )}

    </div>
  );
}

export default Materials;