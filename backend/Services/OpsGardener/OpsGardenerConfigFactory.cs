using System;

namespace Serendipity.OpsAgents
{
    public static class OpsGardenerConfigFactory
    {
        /// <summary>
        /// Crear configuración según el modo requerido
        /// </summary>
        public static OpsGardenerConfig CreateConfig(OpsMode mode, bool autoFix = false)
        {
            return mode switch
            {
                OpsMode.Audit => new OpsGardenerConfig
                {
                    Mode = OpsMode.Audit,
                    AutoFix = false // Nunca auto-fix en audit
                },

                OpsMode.Repair => new OpsGardenerConfig
                {
                    Mode = OpsMode.Repair,
                    AutoFix = autoFix
                },

                OpsMode.Harmonize => new OpsGardenerConfig
                {
                    Mode = OpsMode.Harmonize,
                    AutoFix = autoFix
                },

                OpsMode.Full => new OpsGardenerConfig
                {
                    Mode = OpsMode.Full,
                    AutoFix = true // Full siempre incluye auto-fix
                },

                _ => new OpsGardenerConfig
                {
                    Mode = OpsMode.Audit,
                    AutoFix = false
                }
            };
        }

        /// <summary>
        /// Crear configuración desde string
        /// </summary>
        public static OpsGardenerConfig CreateConfigFromString(string modeString, bool autoFix = false)
        {
            if (Enum.TryParse<OpsMode>(modeString, ignoreCase: true, out var mode))
            {
                return CreateConfig(mode, autoFix);
            }

            return CreateConfig(OpsMode.Audit);
        }

        /// <summary>
        /// Configuración recomendada para desarrollo
        /// </summary>
        public static OpsGardenerConfig DevelopmentConfig()
        {
            return new OpsGardenerConfig
            {
                Mode = OpsMode.Audit,
                AutoFix = false
            };
        }

        /// <summary>
        /// Configuración recomendada para producción
        /// </summary>
        public static OpsGardenerConfig ProductionConfig()
        {
            return new OpsGardenerConfig
            {
                Mode = OpsMode.Harmonize,
                AutoFix = true
            };
        }

        /// <summary>
        /// Configuración para vigilancia nocturna
        /// </summary>
        public static OpsGardenerConfig NightWatchConfig()
        {
            return new OpsGardenerConfig
            {
                Mode = OpsMode.Harmonize,
                AutoFix = false // Reporta pero no modifica
            };
        }
    }
}
