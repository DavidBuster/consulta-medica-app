import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
} from "@mui/material";

const NoteForm = () => {
  const [noteText, setNoteText] = useState(""); // Estado para el texto de la nota
  const [isImportant, setIsImportant] = useState(false); // Estado para saber si es importante
  const [error, setError] = useState(null); // Estado para manejar errores
  const [success, setSuccess] = useState(null); // Estado para mostrar mensaje de éxito
  const [notes, setNotes] = useState([]); // Estado para almacenar las notas
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  // Cargar notas cuando el componente se monta
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      // Verificar la fecha de expiración guardada en localStorage
      const savedDate = localStorage.getItem("token_expirationDate");

      if (savedDate) {
        const savedDateObj = new Date(savedDate);
        const currentDate = new Date();

        // Si la fecha guardada ha pasado (es decir, ha expirado)
        if (savedDateObj < currentDate) {
          console.log("La sesión ha expirado.");
          localStorage.removeItem("token"); // Eliminar el token expirado
          localStorage.removeItem("token_expirationDate"); // Eliminar la fecha de expiración
          navigate("/login"); // Redirigir al login
        } else {
          fetchNotes();
        }
      } else {
        console.log("No hay fecha de expiración guardada.");
        navigate("/login");
      }
    }
  }, [navigate]);

  // Función para obtener todas las notas
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes(response.data); // Almacenar las notas en el estado
    } catch (err) {
      setError("Error al cargar las notas.");
      console.error(err);
    }
  };

  // Función para manejar el cambio en el texto de la nota
  const handleTextChange = (event) => {
    setNoteText(event.target.value);
  };

  // Función para manejar el cambio en el checkbox de "importante"
  const handleCheckboxChange = () => {
    setIsImportant(!isImportant);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!noteText.trim()) {
      setError("Por favor, escribe una nota.");
      return;
    }

    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("No estás autenticado. Por favor, inicia sesión.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/notes`,
        {
          content: noteText,
          important: isImportant,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Nota enviada exitosamente!");
      setNoteText(""); // Limpiar el campo de texto
      setIsImportant(false); // Resetear el checkbox
      fetchNotes(); // Recargar las notas
    } catch (err) {
      setError("Error al enviar la nota. Intenta nuevamente.");
      console.error(err);
    }
  };

  // Función para eliminar una nota
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No estás autenticado. Por favor, inicia sesión.");
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess("Nota eliminada exitosamente!");
      fetchNotes(); // Recargar las notas después de eliminar
    } catch (err) {
      setError("Error al eliminar la nota. Intenta nuevamente.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Escribe una Nota</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nota:
            <textarea
              value={noteText}
              onChange={handleTextChange}
              placeholder="Escribe tu nota aquí"
              rows="4"
              cols="50"
              required
            />
          </label>
        </div>
        <div>
          <label>
            Importante:
            <input
              type="checkbox"
              checked={isImportant}
              onChange={handleCheckboxChange}
            />
          </label>
        </div>
        <div>
          <button type="submit">Enviar</button>
        </div>
      </form>

      {/* Mostrar errores o mensajes de éxito */}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}

      <h2>Notas</h2>
      <Grid container spacing={2}>
        {notes.length > 0 ? (
          notes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{note.content}</Typography>
                  <Typography color="textSecondary">
                    {note.important ? "Importante" : "No Importante"}
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(note.id)}
                  >
                    Eliminar
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <div>No hay notas disponibles.</div>
        )}
      </Grid>
    </div>
  );
};

export default NoteForm;
