# 💰 Sistema de Finanças Pessoais

Sistema web completo para controle de finanças pessoais com foco em **segurança** e **boas práticas**.

![Status](https://img.shields.io/badge/status-ativo-success.svg)
![Versão](https://img.shields.io/badge/vers%C3%A3o-1.0.0-blue.svg)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-green.svg)

---

## 🛠️ Tecnologias Utilizadas

### **Backend**
- **ASP.NET Core 9** - Framework web
- **C#** - Linguagem de programação
- **Entity Framework Core** - ORM
- **MySQL** - Banco de dados
- **JWT** - Autenticação
- **BCrypt** - Hash de senhas
- **Swagger** - Documentação da API (desabilitado em produção)

### **Frontend**
- **React 18** - Biblioteca JavaScript
- **React Router DOM** - Roteamento
- **Axios** - Requisições HTTP
- **Context API** - Gerenciamento de estado
- **CSS3** - Estilização

### **Ferramentas**
- **XAMPP** - Servidor MySQL local
- **MySQL Workbench** - Gerenciamento do banco
- **Visual Studio Code** - Editor de código
- **Git** - Controle de versão

---

## 🏗️ Arquitetura

```
ProjetoCaixeta/
├── financas-backend/          # API em C#
│   ├── Controllers/           # Controladores da API
│   ├── Models/                # Modelos de dados
│   ├── DTOs/                  # Data Transfer Objects
│   ├── Services/              # Lógica de negócio
│   ├── Data/                  # Contexto do banco
│   ├── Helpers/               # Funções auxiliares
│   ├── Migrations/            # Migrações do banco
│   ├── wwwroot/uploads/       # Upload de arquivos
│   ├── appsettings.json       # Configurações
│   └── Program.cs             # Configuração da aplicação
│
└── financas-frontend/         # Interface React
    ├── src/
    │   ├── components/        # Componentes reutilizáveis
    │   │   └── layout/        # Layout (Sidebar, etc)
    │   ├── pages/             # Páginas da aplicação
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Categorias.jsx
    │   │   └── Transacoes.jsx
    │   ├── services/          # Comunicação com API
    │   ├── context/           # Context API (AuthContext)
    │   ├── utils/             # Funções utilitárias
    │   ├── App.jsx            # Componente principal
    │   └── index.css          # Estilos globais
    └── package.json

```

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (v16 ou superior) - [Download](https://nodejs.org/)
- **.NET 9 SDK** - [Download](https://dotnet.microsoft.com/pt-br/download/dotnet/9.0)
- **MySQL** (via XAMPP ou standalone) - [Download XAMPP](https://www.apachefriends.org/)
- **Git** - [Download](https://git-scm.com/)

---

## 🚀 Instalação

### **1. Clone o repositório**

```bash
git clone https://github.com/seu-usuario/financas-pessoais.git
cd financas-pessoais
```

### **2. Configurar o Backend**

```bash
cd financas-backend

# Restaurar dependências
dotnet restore

# Criar o banco de dados
dotnet ef database update

# OU execute o script SQL manualmente no MySQL Workbench
```

### **3. Configurar o Frontend**

```bash
cd financas-frontend

# Instalar dependências
npm install
```
---

## ▶️ Executando o Projeto

### **1. Iniciar o MySQL (XAMPP)**

```bash
# Abra o XAMPP Control Panel
# Clique em "Start" no módulo MySQL
# Aguarde até ficar verde
```

### **2. Executar o Backend**

```bash
cd financas-backend
dotnet run
```

A API estará disponível em: `http://localhost:5134`

### **3. Executar o Frontend**

Em outro terminal:

```bash
cd financas-frontend
npm start
```

O frontend estará disponível em: `http://localhost:3000`

### **4. Acessar o Sistema**

1. Abra o navegador em `http://localhost:3000`
2. Crie uma conta na tela de cadastro
3. Faça login
4. Comece a usar! 🎉

---

## 📁 Estrutura de Pastas

### **Backend**

```
financas-backend/
├── Controllers/
│   ├── AuthController.cs         # Login e registro
│   ├── CategoriasController.cs   # CRUD de categorias
│   └── TransacoesController.cs   # CRUD de transações
├── Models/
│   ├── Usuario.cs
│   ├── Categoria.cs
│   ├── Transacao.cs
│   ├── Anexo.cs
│   └── TokenAcesso.cs
├── DTOs/
│   ├── LoginDTO.cs
│   ├── CategoriaDTO.cs
│   └── TransacaoDTO.cs
├── Services/
│   └── AuthService.cs            # Lógica de autenticação
├── Data/
│   └── ApplicationDbContext.cs   # Contexto do EF Core
├── Helpers/
│   └── HashHelper.cs             # BCrypt para senhas
└── Program.cs                     # Configuração da aplicação
```

### **Frontend**

```
financas-frontend/
├── src/
│   ├── components/
│   │   └── layout/
│   │       ├── Sidebar.jsx       # Menu lateral
│   │       └── Layout.jsx        # Wrapper do layout
│   ├── pages/
│   │   ├── Login.jsx             # Tela de login
│   │   ├── Register.jsx          # Tela de cadastro
│   │   ├── Dashboard.jsx         # Tela principal
│   │   ├── Categorias.jsx        # Gestão de categorias
│   │   └── Transacoes.jsx        # Gestão de transações
│   ├── services/
│   │   ├── api.js                # Configuração Axios
│   │   ├── authService.js        # Serviço de autenticação
│   │   ├── categoriaService.js   # Serviço de categorias
│   │   └── transacaoService.js   # Serviço de transações
│   ├── context/
│   │   └── AuthContext.jsx       # Contexto de autenticação
│   ├── utils/
│   │   └── formatters.js         # Formatação de moeda e data
│   ├── App.jsx                    # Rotas da aplicação
│   └── index.css                  # Estilos globais
└── package.json
```
---

## 📊 Banco de Dados

### **Tabelas Principais**

```sql
-- ============================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS
-- Sistema de Finanças Pessoais Seguro
-- SGBD: MySQL 8.0+
-- ============================================

-- Criar e usar o banco de dados
DROP DATABASE IF EXISTS FinancasDB;
CREATE DATABASE FinancasDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE FinancasDB;

-- ============================================
-- TABELA: Usuarios
-- Armazena dados de autenticação e perfil
-- ============================================
CREATE TABLE Usuarios (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL, -- Senha criptografada (bcrypt/PBKDF2)
    Salt VARCHAR(255) NOT NULL, -- Salt único por usuário
    EmailConfirmado BOOLEAN DEFAULT FALSE,
    TokenConfirmacaoEmail VARCHAR(255) NULL,
    TokenResetSenha VARCHAR(255) NULL,
    DataExpiracaoTokenReset DATETIME NULL,
    TentativasLoginFalhadas INT DEFAULT 0,
    ContaBloqueada BOOLEAN DEFAULT FALSE,
    DataBloqueio DATETIME NULL,
    DataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    DataAtualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UltimoLogin DATETIME NULL,
    INDEX idx_email (Email),
    INDEX idx_token_reset (TokenResetSenha)
) ENGINE=InnoDB;

-- ============================================
-- TABELA: Categorias
-- Categorias de transações (Receita/Despesa)
-- ============================================
CREATE TABLE Categorias (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(50) NOT NULL,
    Tipo ENUM('Receita', 'Despesa') NOT NULL,
    Cor VARCHAR(7) DEFAULT '#3B82F6', -- Cor em hexadecimal para UI
    Icone VARCHAR(50) DEFAULT 'tag', -- Nome do ícone (Lucide React)
    UsuarioId INT NOT NULL,
    Ativo BOOLEAN DEFAULT TRUE,
    DataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id) ON DELETE CASCADE,
    INDEX idx_usuario_tipo (UsuarioId, Tipo)
) ENGINE=InnoDB;

-- ============================================
-- TABELA: Transacoes
-- Registro de receitas e despesas
-- ============================================
CREATE TABLE Transacoes (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Descricao VARCHAR(255) NOT NULL,
    Valor DECIMAL(15, 2) NOT NULL,
    Tipo ENUM('Receita', 'Despesa') NOT NULL,
    Data DATE NOT NULL,
    CategoriaId INT NOT NULL,
    UsuarioId INT NOT NULL,
    Observacoes TEXT NULL,
    Recorrente BOOLEAN DEFAULT FALSE,
    TipoRecorrencia ENUM('Diaria', 'Semanal', 'Mensal', 'Anual') NULL,
    DataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    DataAtualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CategoriaId) REFERENCES Categorias(Id) ON DELETE RESTRICT,
    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id) ON DELETE CASCADE,
    INDEX idx_usuario_data (UsuarioId, Data),
    INDEX idx_usuario_tipo (UsuarioId, Tipo),
    INDEX idx_categoria (CategoriaId)
) ENGINE=InnoDB;

-- ============================================
-- TABELA: Anexos
-- Armazena cupons fiscais e comprovantes
-- ============================================
CREATE TABLE Anexos (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    TransacaoId INT NOT NULL,
    NomeArquivo VARCHAR(255) NOT NULL,
    NomeArquivoOriginal VARCHAR(255) NOT NULL,
    CaminhoArquivo VARCHAR(500) NOT NULL, -- Path relativo ao servidor
    TipoMime VARCHAR(100) NOT NULL,
    TamanhoBytes BIGINT NOT NULL,
    HashArquivo VARCHAR(64) NOT NULL, -- SHA-256 do arquivo para integridade
    DataUpload DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (TransacaoId) REFERENCES Transacoes(Id) ON DELETE CASCADE,
    INDEX idx_transacao (TransacaoId)
) ENGINE=InnoDB;

-- ============================================
-- TABELA: TokensAcesso
-- Armazena refresh tokens JWT para autenticação
-- ============================================
CREATE TABLE TokensAcesso (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    UsuarioId INT NOT NULL,
    RefreshToken VARCHAR(500) NOT NULL UNIQUE,
    DataExpiracao DATETIME NOT NULL,
    DataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    Revogado BOOLEAN DEFAULT FALSE,
    DataRevogacao DATETIME NULL,
    IpAddress VARCHAR(45) NULL, -- IPv4 ou IPv6
    UserAgent VARCHAR(500) NULL,
    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id) ON DELETE CASCADE,
    INDEX idx_usuario (UsuarioId),
    INDEX idx_refresh_token (RefreshToken),
    INDEX idx_expiracao (DataExpiracao)
) ENGINE=InnoDB;

-- ============================================
-- TABELA: LogsAuditoria
-- Registro de ações importantes para auditoria
-- ============================================
CREATE TABLE LogsAuditoria (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    UsuarioId INT NULL, -- NULL para ações anônimas (tentativas de login)
    Acao VARCHAR(100) NOT NULL, -- Ex: 'LOGIN', 'LOGOUT', 'CRIAR_TRANSACAO', 'UPLOAD_ARQUIVO'
    Entidade VARCHAR(50) NULL, -- Ex: 'Transacao', 'Usuario', 'Anexo'
    EntidadeId INT NULL, -- ID da entidade afetada
    Detalhes TEXT NULL, -- JSON com informações adicionais
    IpAddress VARCHAR(45) NULL,
    UserAgent VARCHAR(500) NULL,
    DataAcao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id) ON DELETE SET NULL,
    INDEX idx_usuario (UsuarioId),
    INDEX idx_data (DataAcao),
    INDEX idx_acao (Acao)
) ENGINE=InnoDB;

-- ============================================
-- INSERIR DADOS INICIAIS (Opcional)
-- ============================================

-- Categorias padrão para novos usuários (você pode popular depois via aplicação)
-- Exemplo: INSERT INTO Categorias (Nome, Tipo, Cor, Icone, UsuarioId) VALUES ('Salário', 'Receita', '#10B981', 'dollar-sign', 1);

-- ============================================
-- VIEWS ÚTEIS (Opcional)
-- ============================================

-- View: Resumo mensal por usuário
CREATE VIEW vw_ResumoMensal AS
SELECT 
    UsuarioId,
    YEAR(Data) AS Ano,
    MONTH(Data) AS Mes,
    SUM(CASE WHEN Tipo = 'Receita' THEN Valor ELSE 0 END) AS TotalReceitas,
    SUM(CASE WHEN Tipo = 'Despesa' THEN Valor ELSE 0 END) AS TotalDespesas,
    SUM(CASE WHEN Tipo = 'Receita' THEN Valor ELSE -Valor END) AS Saldo
FROM Transacoes
GROUP BY UsuarioId, YEAR(Data), MONTH(Data);

-- View: Transações com detalhes de categoria
CREATE VIEW vw_TransacoesDetalhadas AS
SELECT 
    t.Id,
    t.Descricao,
    t.Valor,
    t.Tipo,
    t.Data,
    c.Nome AS Categoria,
    c.Cor AS CorCategoria,
    c.Icone AS IconeCategoria,
    u.Nome AS Usuario,
    t.Observacoes,
    t.Recorrente,
    t.DataCriacao
FROM Transacoes t
INNER JOIN Categorias c ON t.CategoriaId = c.Id
INNER JOIN Usuarios u ON t.UsuarioId = u.Id;

-- ============================================
-- FIM DO SCRIPT
-- ============================================
```

---


<div align="center">

**Desenvolvido com ❤️ e ☕**

Miguel A.
Natanael B.
Luiz F.

</div>
