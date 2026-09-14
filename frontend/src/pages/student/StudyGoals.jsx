import { useEffect, useState } from "react";

import api from "../../services/api";

import "./StudyGoals.css";

function StudyGoals() {
  const [goals, setGoals] = useState([]);

  const [title, setTitle] = useState("");

  const [description, setDescription] =
    useState("");

  const [targetDate, setTargetDate] =
    useState("");


  const fetchGoals = async () => {
    try {
      const response =
        await api.get("/goals");

      setGoals(
        response.data.goals || []
      );
    } catch (error) {
      console.error(
        "FETCH GOALS ERROR:",
        error
      );
    }
  };


  useEffect(() => {
    fetchGoals();
  }, []);


  const createGoal = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "/goals",
        {
          title,
          description,
          targetDate
        }
      );

      setTitle("");

      setDescription("");

      setTargetDate("");

      fetchGoals();

    } catch (error) {
      console.error(
        "CREATE GOAL ERROR:",
        error
      );
    }
  };


  const completeGoal = async (id) => {
    try {
      await api.patch(
        `/goals/${id}/complete`
      );

      fetchGoals();

    } catch (error) {
      console.error(
        "COMPLETE GOAL ERROR:",
        error
      );
    }
  };


  return (
    <div className="study-goals-page">

      {/* =================================
          PAGE HEADER
      ================================= */}

      <div className="study-goals-header">

        <div className="study-goals-header-content">

          <div className="study-goals-icon">
            🎯
          </div>

          <div>
            <h1>
              Study Goals
            </h1>

            <p>
              Set your learning goals, track your
              progress, and stay focused.
            </p>
          </div>

        </div>

        <div className="study-goals-count">
          {goals.length}{" "}
          {goals.length === 1
            ? "Goal"
            : "Goals"}
        </div>

      </div>


      {/* =================================
          CREATE GOAL
      ================================= */}

      <div className="create-goal-card">

        <div className="create-goal-heading">

          <div className="create-goal-heading-icon">
            ✨
          </div>

          <div>
            <h2>
              Create New Goal
            </h2>

            <p>
              Set a target and work towards it.
            </p>
          </div>

        </div>


        <form
          className="study-goal-form"
          onSubmit={createGoal}
        >

          <div className="goal-form-group">

            <label>
              Goal Title
            </label>

            <input
              type="text"
              placeholder="Example: Complete JavaScript course"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              required
            />

          </div>


          <div className="goal-form-group">

            <label>
              Description
            </label>

            <textarea
              placeholder="Describe what you want to achieve..."
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows={4}
            />

          </div>


          <div className="goal-form-group">

            <label>
              Target Date
            </label>

            <input
              type="date"
              value={targetDate}
              onChange={(e) =>
                setTargetDate(
                  e.target.value
                )
              }
              required
            />

          </div>


          <button
            type="submit"
            className="create-goal-btn"
          >
            <span>＋</span>

            Create Goal
          </button>

        </form>

      </div>


      {/* =================================
          GOALS SECTION
      ================================= */}

      <div className="study-goals-section">

        <div className="study-goals-section-header">

          <div>
            <h2>
              My Study Goals
            </h2>

            <p>
              Keep track of everything you want
              to accomplish.
            </p>
          </div>

          <span className="goal-total">
            {goals.length}{" "}
            {goals.length === 1
              ? "Goal"
              : "Goals"}
          </span>

        </div>


        {goals.length === 0 ? (

          <div className="study-goals-empty">

            <div className="study-goals-empty-icon">
              🎯
            </div>

            <h2>
              No Study Goals Yet
            </h2>

            <p>
              Create your first study goal and
              start working towards it.
            </p>

          </div>

        ) : (

          <div className="study-goals-grid">

            {goals.map((goal) => (

              <div
                className={
                  goal.completed
                    ? "study-goal-card completed"
                    : "study-goal-card"
                }
                key={goal._id}
              >

                {/* CARD TOP */}

                <div className="study-goal-card-top">

                  <div className="study-goal-card-icon">
                    {goal.completed
                      ? "✓"
                      : "🎯"}
                  </div>

                  <span
                    className={
                      goal.completed
                        ? "goal-status completed-status"
                        : "goal-status pending-status"
                    }
                  >
                    {goal.completed
                      ? "Completed"
                      : "Pending"}
                  </span>

                </div>


                {/* TITLE */}

                <h3>
                  {goal.title}
                </h3>


                {/* DESCRIPTION */}

                {goal.description && (
                  <p className="goal-description">
                    {goal.description}
                  </p>
                )}


                {/* TARGET DATE */}

                <div className="goal-target-date">

                  <span className="goal-date-icon">
                    📅
                  </span>

                  <div>
                    <span>
                      Target Date
                    </span>

                    <strong>
                      {new Date(
                        goal.targetDate
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        }
                      )}
                    </strong>
                  </div>

                </div>


                {/* COMPLETE BUTTON */}

                {!goal.completed && (

                  <button
                    type="button"
                    className="complete-goal-btn"
                    onClick={() =>
                      completeGoal(
                        goal._id
                      )
                    }
                  >
                    <span>✓</span>

                    Mark Complete
                  </button>

                )}


                {goal.completed && (

                  <div className="goal-completed-message">
                    ✓ Goal completed successfully
                  </div>

                )}

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default StudyGoals;