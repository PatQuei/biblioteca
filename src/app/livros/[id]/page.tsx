"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const styles = {
  section: {
    maxWidth: "400px",
    margin: "32px auto",
    padding: "24px",
    background: "#23272f",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
    color: "#eaf2fb",
    border: "2px solid #2376ae",
  },
  btn: {
    marginRight: "12px",
    padding: "8px 20px",
    fontWeight: "bold",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "filter 0.2s",
    textDecoration: "none",
    display: "inline-block",
  },
  btnEdit: {
    backgroundColor: "#bbf7d0",
    color: "#065f46",
    border: "1px solid #065f46",
  },
  btnExcluir: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    border: "1px solid #b91c1c",
  },
  errorSection: {
    maxWidth: "400px",
    margin: "32px auto",
    padding: "24px",
    backgroundColor: "#331111",
    color: "#fdd",
    borderRadius: "16px",
    textAlign: "center" as const,
  }
};

const livrosIniciais = [
  { id: "1", titulo: "Aprendendo React", autor: "Daniele", ano: 2023, resumo: "Livro sobre React para iniciantes." },
  { id: "2", titulo: "Dominando Next.js", autor: "Daniele", ano: 2024, resumo: "Guia prático de Next.js." },
];

export default function LivroDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const [livros, setLivros] = useState(livrosIniciais);

  const livroId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const livro = livros.find(l => l.id === livroId);

  function excluirLivro(id: string) {
    if (window.confirm("Tem certeza que deseja excluir este livro?")) {
      setLivros(livros.filter(l => l.id !== id));
      router.push("/livros");
    }
  }

  if (!livro) {
    return (
      <section style={styles.errorSection}>
        <h2>Livro não encontrado.</h2>
        <Link href="/livros" style={{ ...styles.btn, ...styles.btnEdit }}>Voltar para lista</Link>
      </section>
    );
  }

  return (
    <section style={styles.section}>
      <h1>Livro: {livro.titulo}</h1>
      <p><strong>Autor:</strong> {livro.autor}</p>
      <p><strong>Ano:</strong> {livro.ano}</p>
      <p><strong>Resumo:</strong> {livro.resumo}</p>
      <div style={{ marginTop: "24px" }}>
        <Link href={`/livros/${livro.id}/editar`} style={{ ...styles.btn, ...styles.btnEdit }}>Editar</Link>
        <button onClick={() => excluirLivro(livro.id)} style={{ ...styles.btn, ...styles.btnExcluir }}>Excluir</button>
      </div>
    </section>
  );
}
