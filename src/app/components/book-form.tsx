"use client";

import { useState, useMemo, useEffect } from "react";

interface BookFormData {
  titulo: string;
  autor: string;
  ano?: string;
  capa?: string;
  descricao?: string;
}

interface BookFormProps {
  initialData?: BookFormData | null;
  onSubmit: (data: BookFormData) => void;
}

export default function BookForm({ initialData = null, onSubmit }: BookFormProps) {
  const [formData, setFormData] = useState<BookFormData>({
    titulo: "",
    autor: "",
    ano: "",
    capa: "",
    descricao: "",
  });

  // Carregar dados iniciais (modo edição)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const camposObrigatorios = ["titulo", "autor"];
  const totalCampos = Object.keys(formData).length;
  const preenchidos = useMemo(() => {
    return Object.entries(formData).filter(
      ([key, value]) =>
        value && (camposObrigatorios.includes(key) || value.trim() !== "")
    ).length;
  }, [formData]);

  const progresso = Math.round((preenchidos / totalCampos) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo || !formData.autor) {
      alert("Preencha os campos obrigatórios!");
      return;
    }
    onSubmit(formData);

    // Resetar apenas no modo adicionar
    if (!initialData) {
      setFormData({
        titulo: "",
        autor: "",
        ano: "",
        capa: "",
        descricao: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Barra de progresso */}
      <div>
        <div className="h-2 w-full bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-500 rounded-full transition-all"
            style={{ width: `${progresso}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-1">{progresso}% completo</p>
      </div>

      {/* Título */}
      <div>
        <label className="block font-medium">
          Título <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        />
      </div>

      {/* Autor */}
      <div>
        <label className="block font-medium">
          Autor <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="autor"
          value={formData.autor}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        />
      </div>

      {/* Ano */}
      <div>
        <label className="block font-medium">Ano</label>
        <input
          type="number"
          name="ano"
          value={formData.ano}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Capa */}
      <div>
        <label className="block font-medium">URL da Capa</label>
        <input
          type="url"
          name="capa"
          value={formData.capa}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
        {formData.capa && (
          <div className="mt-3">
            <p className="text-sm mb-1">Pré-visualização:</p>
            <img
              src={formData.capa}
              alt="Preview da capa"
              className="w-32 h-44 object-cover border rounded-lg shadow"
            />
          </div>
        )}
      </div>

      {/* Descrição */}
      <div>
        <label className="block font-medium">Descrição</label>
        <textarea
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          rows={4}
        />
      </div>

      {/* Botão */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition"
      >
        {initialData ? "Atualizar" : "Salvar"}
      </button>
    </form>
  );
}
