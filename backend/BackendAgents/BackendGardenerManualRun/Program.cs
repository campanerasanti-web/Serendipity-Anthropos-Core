using System;
using System.Threading.Tasks;
using ElMediadorDeSofia.BackendAgents;

namespace BackendGardenerManualRun
{
	class Program
	{
		static async Task Main(string[] args)
		{
			var config = new BackendGardenerConfig
			{
				Mode = AgentMode.Full,
				AutoFix = true,
				OutputFormat = "both"
			};

			var agent = new BackendGardenerAgent(config);
			var report = await agent.RunAsync();

			Console.WriteLine("\n==== REPORTE DEL JARDINERO DEL BACKEND ====");
			// Aquí podrías imprimir el reporte en markdown o consola según OutputFormat
			// Ejemplo: Console.WriteLine(report.ToString());
		}
	}
}
