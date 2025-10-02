"use client";

import React, { useState } from "react";

interface DeleteBookButtonProps {
  onDelete: () => void; // Função a rodar para excluir
  disabled?: boolean;    // Desabilita o botão se quiser
}

export default function DeleteBookButton({ onDelete, disabled }: DeleteBookButtonProps) {
  const [open, setOpen] = useState(false);

  function handleConfirm() {
    setOpen(false);
    onDelete();
  }

  return (
    <>
      <button
        disabled={disabled}
        onClick={() => setOpen(true)}
        style={{
          backgroundColor: "#ff4d4f",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Excluir Livro
      </button>

      {open && (
        <div style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            maxWidth: "300px",
            textAlign: "center"
          }}>
            <p>Tem certeza que deseja excluir este livro?</p>
            <button onClick={handleConfirm} style={{ ...btnStyle, backgroundColor: "#ff4d4f" }}>
              Confirmar
            </button>
            <button onClick={() => setOpen(false)} style={{ ...btnStyle, marginLeft: "10px" }}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const btnStyle = {
  padding: "8px 16px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
};
