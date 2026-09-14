import { useEffect, useState } from "react";

import api from "../../services/api";

import "./PersonalNotes.css";

function PersonalNotes() {
  const [notes, setNotes] = useState([]);

  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);


  // GET NOTES
  const fetchNotes = async () => {
    try {
      const response =
        await api.get("/notes");

      setNotes(
        response.data.notes || []
      );
    } catch (error) {
      console.error(
        "FETCH NOTES ERROR:",
        error.response?.data ||
        error.message
      );
    }
  };


  useEffect(() => {
    fetchNotes();
  }, []);


  // CREATE NOTE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !content.trim()
    ) {
      return;
    }

    try {
      setLoading(true);

      const response =
        await api.post(
          "/notes",
          {
            title: title.trim(),
            content: content.trim()
          }
        );

      setNotes(
        (previousNotes) => [
          response.data.note,
          ...previousNotes
        ]
      );

      setTitle("");

      setContent("");
    } catch (error) {
      console.error(
        "CREATE NOTE ERROR:",
        error.response?.data ||
        error.message
      );
    } finally {
      setLoading(false);
    }
  };


  // DELETE NOTE
  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this note?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(
        `/notes/${id}`
      );

      setNotes(
        (previousNotes) =>
          previousNotes.filter(
            (note) =>
              note._id !== id
          )
      );
    } catch (error) {
      console.error(
        "DELETE NOTE ERROR:",
        error.response?.data ||
        error.message
      );
    }
  };


  return (
    <div className="personal-notes-page">

      {/* HEADER */}

      <div className="personal-notes-header">

        <div className="personal-notes-header-content">

          <div className="personal-notes-icon">
            📒
          </div>

          <div>
            <h1>
              Personal Notes
            </h1>

            <p>
              Create and manage your personal
              study notes in one place.
            </p>
          </div>

        </div>

      </div>


      {/* CREATE NOTE */}

      <div className="create-note-card">

        <div className="create-note-heading">

          <div className="create-note-heading-icon">
            ✏️
          </div>

          <h2>
            Create New Note
          </h2>

        </div>


        <form
          className="personal-note-form"
          onSubmit={handleSubmit}
        >

          <input
            className="personal-note-input"
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />


          <textarea
            className="personal-note-textarea"
            placeholder="Write your note..."
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
          />


          <button
            className="add-note-btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "＋ Add Note"}
          </button>

        </form>

      </div>


      {/* NOTES */}

      <div className="personal-notes-list">

        <div className="personal-notes-section-header">

          <div>
            <h2>
              My Notes
            </h2>

            <p>
              Your personal study notes.
            </p>
          </div>

          <span className="notes-count">
            {notes.length}{" "}
            {notes.length === 1
              ? "Note"
              : "Notes"}
          </span>

        </div>


        {notes.length === 0 ? (

          <div className="personal-notes-empty">

            <div className="personal-notes-empty-icon">
              📒
            </div>

            <h2>
              No Personal Notes Yet
            </h2>

            <p>
              Create your first note to keep
              important study information organized.
            </p>

          </div>

        ) : (

          <div className="notes-grid">

            {notes.map((note) => (

              <div
                key={note._id}
                className="personal-note-card"
              >

                <div className="note-card-header">

                  <div className="note-card-title-wrapper">

                    <div className="note-card-icon">
                      📌
                    </div>

                    <h3>
                      {note.title}
                    </h3>

                  </div>

                </div>


                <p className="note-card-content">
                  {note.content}
                </p>


                <button
                  className="delete-note-btn"
                  type="button"
                  onClick={() =>
                    handleDelete(
                      note._id
                    )
                  }
                >
                  🗑 Delete
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default PersonalNotes;