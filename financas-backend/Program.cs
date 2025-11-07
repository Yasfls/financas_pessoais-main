using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using financas_backend.Data;
using financas_backend.Services;
 
var builder = WebApplication.CreateBuilder(args);
 
var configuration = builder.Configuration;
 
// ✅ Lê SecretKey do User-Secrets ou Variável de Ambiente
var secretKey =
    configuration["JwtSettings:SecretKey"] ??
    Environment.GetEnvironmentVariable("JWT_SECRET");
 
if (string.IsNullOrEmpty(secretKey))
    throw new InvalidOperationException("JWT SecretKey não configurada. Defina via ambiente ou user-secrets.");
 
var keyBytes = Encoding.UTF8.GetBytes(secretKey);
var signingKey = new SymmetricSecurityKey(keyBytes);
 
// ✅ Caso ainda não exista, configure o CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowAnyOrigin(); // ou restringir para segurança
    });
});
 
// ✅ Configurar o banco (se já tinha, mantenha sua connection string real)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(configuration.GetConnectionString("DefaultConnection")))
);
 
// ✅ Registrar serviços
builder.Services.AddScoped<AuthService, AuthService>();
 
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = signingKey,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = configuration["JwtSettings:Issuer"],
            ValidAudience = configuration["JwtSettings:Audience"]
        };
    });
 
builder.Services.AddControllers();
 
var app = builder.Build();
 
app.UseHttpsRedirection();
 
app.UseCors("AllowFrontend");
 
app.UseAuthentication();
app.UseAuthorization();
 
app.UseStaticFiles();
app.MapControllers();
 
app.Run();