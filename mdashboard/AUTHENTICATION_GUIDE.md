# Guia de Autenticação

## ✅ O que foi implementado

### Frontend

1. **Hook `useAuth` completo** com:

   - `isAuthenticated`: boolean indicando se o usuário está autenticado
   - `isChecking`: boolean para loading inicial da validação
   - `user`: objeto com dados do usuário (id, name, email)
   - `checkAuth()`: função para revalidar o token
   - Validação automática ao montar o componente

2. **Função `validateToken()` no api.ts**:
   - Chama `GET /api/auth/validate`
   - Envia o token no header automaticamente

### Backend (VOCÊ PRECISA CRIAR)

Crie uma rota no seu backend:

```go
// Exemplo em Go
GET /api/auth/validate
Authorization: Bearer {token}

// Resposta de sucesso
{
  "valid": true,
  "user": {
    "id": "123",
    "name": "João Silva",
    "email": "joao@example.com"
  }
}

// Resposta de erro
Status 401
{
  "valid": false,
  "message": "Token inválido ou expirado"
}
```

## 📖 Como usar

### Em qualquer página/componente:

```tsx
"use client";

import { useAuth } from "@/hooks/useAuth";

export default function MyPage() {
  const { isAuthenticated, isChecking, user, logout } = useAuth();

  // Loading inicial
  if (isChecking) {
    return <div>Verificando autenticação...</div>;
  }

  // Não autenticado
  if (!isAuthenticated) {
    return <div>Você precisa fazer login</div>;
  }

  // Autenticado
  return (
    <div>
      <h1>Bem-vindo, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

### No AuthHeader (exemplo):

```tsx
// Na página pai
const { isAuthenticated } = useAuth();

<AuthHeader
  linkHref={isAuthenticated ? "/dashboard" : "/login"}
  linkText={isAuthenticated ? "Dashboard" : "Login"}
/>;
```

### Proteção de rotas:

```tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { isAuthenticated, isChecking } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isChecking, router]);

  if (isChecking) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return null; // Ou loading, pois vai redirecionar
  }

  return <div>Conteúdo protegido</div>;
}
```

## 🔒 Fluxo de segurança

1. **Usuário faz login** → Token salvo no coockiesjs
2. **Página carrega** → `useAuth` verifica se tem token
3. **Se tem token** → Chama `/api/auth/validate` no backend
4. **Backend valida** → Verifica se token é válido, não expirou, usuário existe
5. **Retorna resultado** → Frontend define `isAuthenticated` e `user`
6. **Token inválido** → Limpa coockiesjs e redireciona para login

## ⚠️ Importante

- O token é enviado automaticamente em TODAS as requisições (axios interceptor)
- Se qualquer requisição retornar 401, o token é removido automaticamente
- Sempre use `isChecking` para mostrar loading durante a validação inicial
- Não confie apenas no `localStorage`, sempre valide no backend
