'use client';

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Dados exemplo (para simular um banco)
const livros = [
  { id: "1", titulo: "Aprendendo React", autor: "Daniele", ano: 2023, resumo: "Livro sobre React para iniciantes." },
  { id: "2", titulo: "Dominando Next.js", autor: "Daniel", ano: 2024, resumo: "Guia prático de Next.js." },
];

export default function EditarLivroPage() {
  const params = useParams();
  const router = useRouter();

  const livroOriginal = livros.find(l => l.id === params.id);

  const [titulo, setTitulo] = useState(livroOriginal?.titulo || "");
  const [autor, setAutor] = useState(livroOriginal?.autor || "");
  const [ano, setAno] = useState(livroOriginal?.ano || "");
  const [resumo, setResumo] = useState(livroOriginal?.resumo || "");

  if (!livroOriginal) {
    return <div>Livro não encontrado.</div>;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    // Aqui você pegaria os dados e faria update no backend ou estado global
    alert(`Livro atualizado:\nTítulo: ${titulo}\nAutor: ${autor}\nAno: ${ano}\nResumo: ${resumo}`);
    router.push(`/livros/${params.id}`); // Volta para detalhes após salvar
  }

  return (
    <section style={{ maxWidth: 400, margin: "32px auto", padding: 16, border: "1px solid #ccc", borderRadius: 8 }}>
      <h1>Editar Livro</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Título:
          <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required />
        </label>
        <br />
        <label>
          Autor:
          <input type="text" value={autor} onChange={e => setAutor(e.target.value)} required />
        </label>
        <br />
        <label>
          Ano:
          <input type="number" value={ano} onChange={e => setAno(e.target.value)} required />
        </label>
        <br />
        <label>
          Resumo:
          <textarea value={resumo} onChange={e => setResumo(e.target.value)} required />
        </label>
        <br />
        <button type="submit" style={{ marginTop: 12 }}>
          Salvar
        </button>
      </form>
    </section>
  );
}
