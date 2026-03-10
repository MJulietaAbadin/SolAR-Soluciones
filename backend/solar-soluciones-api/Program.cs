using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using SolarSoluciones.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// CORS - permite el frontend Next.js
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "https://localhost:3000",
                builder.Configuration["Cors:AllowedOrigin"] ?? "http://localhost:3000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// JWT Auth
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key no configurada");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// Servicios de la aplicación
builder.Services.AddScoped<ISimuladorService, SimuladorService>();
builder.Services.AddScoped<ILeadService, LeadService>();
builder.Services.AddScoped<IProyectoService, ProyectoService>();
builder.Services.AddScoped<IBlogService, BlogService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEventoService, EventoService>();
builder.Services.AddScoped<IParametrosService, ParametrosService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("FrontendPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
