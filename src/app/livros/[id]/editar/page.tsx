"use client";
import React, { useState } from "react";


interface Livro {
  title: string;
  author: string;
  ano?: string;
  description?: string;
}

interface EditarLivroProps {
  livroInicial: Livro;
  onSalvar: (livro: Livro) => void;
}

export default function EditarLivro({ livroInicial, onSalvar }: EditarLivroProps) {
  const livroDefault: Livro = {
    title: "Aprendendo React",
    author: "Daniele",
    ano: "2023",
    description: "Livro sobre React para iniciantes."
  };
  const [livro, setLivro] = useState<Livro>(livroInicial ?? livroDefault);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setLivro({ ...livro, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSalvar(livro);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "400px",
        margin: "32px auto",
        padding: "24px",
        background: "#f8f9fa",
        borderRadius: "10px",
        boxShadow: "0 0 10px 3px #eee"
      }}
    >
      <h2 style={{ marginBottom: 18 }}>Editar Livro</h2>
      <div style={{ marginBottom: 12 }}>
        <label>Título:</label>
        <input
          type="text"
          name="title"
          value={livro.title}
          onChange={handleChange}
          style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 6, border: "1px solid #aaa" }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Autor:</label>
        <input
          type="text"
          name="author"
          value={livro.author}
          onChange={handleChange}
          style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 6, border: "1px solid #aaa" }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Ano:</label>
        <input
          type="text"
          name="ano"
          value={livro.ano || ""}
          onChange={handleChange}
          style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 6, border: "1px solid #aaa" }}
        />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label>Descrição:</label>
        <textarea
          name="description"
          value={livro.description || ""}
          onChange={handleChange}
          style={{ width: "100%", minHeight: 60, marginTop: 4, padding: 8, borderRadius: 6, border: "1px solid #aaa" }}
        />
      </div>
      <button
        type="submit"
        style={{
          background: "#0070f3",
          color: "#fff",
          padding: "10px 28px",
          border: "none",
          borderRadius: 6,
          fontWeight: "bold",
          fontSize: 16,
          cursor: "pointer"
        }}
      >
        Salvar
      </button>
    </form>
  );
}
