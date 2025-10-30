using System;
using System.Security.Cryptography;
using System.Text;

namespace financas_backend.Helpers
{
    public static class HashHelper
    {
        public static string GenerateSalt()
        {
            byte[] saltBytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(saltBytes);
            }
            return Convert.ToBase64String(saltBytes);
        }

        public static string HashPassword(string password, string salt)
        {
            return BCrypt.Net.BCrypt.HashPassword(password + salt);
        }

        public static bool VerifyPassword(string password, string salt, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(password + salt, hash);
        }

        public static string GenerateToken()
        {
            byte[] tokenBytes = new byte[64];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(tokenBytes);
            }
            return Convert.ToBase64String(tokenBytes);
        }

        public static string HashFile(byte[] fileBytes)
        {
            using (var sha256 = SHA256.Create())
            {
                byte[] hashBytes = sha256.ComputeHash(fileBytes);
                return Convert.ToBase64String(hashBytes);
            }
        }
    }
}