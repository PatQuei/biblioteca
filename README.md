📖 Guia de Uso do BookForm
Onde está

Componente: src/components/book-form.tsx

Página de exemplo (Adicionar): src/app/adicionar/page.tsx

🟢 Adicionar Livro

Exemplo de uso (já implementado em page.tsx):

<BookForm
  onSubmit={(data) => {
    console.log("Novo livro:", data);
    // Aqui cada um pode integrar com API, banco ou mock
  }}
/>


initialData não é usado.

onSubmit recebe os dados do formulário.

🟡 Editar Livro

Para editar, basta passar dados iniciais no initialData e tratar o onSubmit.

Exemplo:

<BookForm
  initialData={{
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    ano: "1899",
    capa: "https://link-da-capa.jpg",
    descricao: "Um clássico da literatura brasileira."
  }}
  onSubmit={(data) => {
    console.log("Livro atualizado:", data);
    // Aqui cada um pode implementar update no backend
  }}
/>


O formulário já abre preenchido.

O botão muda para “Atualizar” automaticamente.

🔧 O que já está pronto

Validação de campos obrigatórios (titulo e autor).

Campos opcionais (ano, capa, descricao).

Preview em tempo real da capa (URL).

Barra de progresso de preenchimento.

Reset automático do formulário apenas no modo adicionar.

👉 Resumindo para o time:

Quem precisar adicionar só usa <BookForm onSubmit={...} />.

Quem precisar editar usa <BookForm initialData={...} onSubmit={...} />.