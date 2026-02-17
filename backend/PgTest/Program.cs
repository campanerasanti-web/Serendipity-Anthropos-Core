using System;
using Npgsql;

partial class Program
{
	static void Main()
	{
		var connString = "Host=localhost;Port=5432;Database=postgres;Username=postgres;Password=Santi@serendipity";
		try
		{
			using var conn = new NpgsqlConnection(connString);
			conn.Open();
			Console.WriteLine("✅ ¡Conexión exitosa a PostgreSQL!");
		}
		catch (Exception ex)
		{
			Console.WriteLine("❌ Error de conexión: " + ex.Message);
		}
	}
}
