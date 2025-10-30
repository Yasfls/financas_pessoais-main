using Microsoft.EntityFrameworkCore;
using financas_backend.Models;

namespace financas_backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Transacao> Transacoes { get; set; }
        public DbSet<Anexo> Anexos { get; set; }
        public DbSet<TokenAcesso> TokensAcesso { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurações de relacionamentos
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.TokenResetSenha);
            });

            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.HasIndex(e => new { e.UsuarioId, e.Tipo });

                entity.HasOne(c => c.Usuario)
                    .WithMany(u => u.Categorias)
                    .HasForeignKey(c => c.UsuarioId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Transacao>(entity =>
            {
                entity.HasIndex(e => new { e.UsuarioId, e.Data });
                entity.HasIndex(e => new { e.UsuarioId, e.Tipo });
                entity.HasIndex(e => e.CategoriaId);

                entity.HasOne(t => t.Usuario)
                    .WithMany(u => u.Transacoes)
                    .HasForeignKey(t => t.UsuarioId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(t => t.Categoria)
                    .WithMany(c => c.Transacoes)
                    .HasForeignKey(t => t.CategoriaId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Anexo>(entity =>
            {
                entity.HasIndex(e => e.TransacaoId);

                entity.HasOne(a => a.Transacao)
                    .WithMany(t => t.Anexos)
                    .HasForeignKey(a => a.TransacaoId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<TokenAcesso>(entity =>
            {
                entity.HasIndex(e => e.UsuarioId);
                entity.HasIndex(e => e.RefreshToken).IsUnique();
                entity.HasIndex(e => e.DataExpiracao);

                entity.HasOne(t => t.Usuario)
                    .WithMany(u => u.TokensAcesso)
                    .HasForeignKey(t => t.UsuarioId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Conversão de Enums para string
            modelBuilder.Entity<Categoria>()
                .Property(c => c.Tipo)
                .HasConversion<string>();

            modelBuilder.Entity<Transacao>()
                .Property(t => t.Tipo)
                .HasConversion<string>();

            modelBuilder.Entity<Transacao>()
                .Property(t => t.TipoRecorrencia)
                .HasConversion<string>();
        }
    }
}