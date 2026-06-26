/**
 * MÓDULO 2: Laboratorio de Proteómica Computacional + AlphaFold
 * 
 * Funcionalidades:
 * - Carga de secuencias de novo
 * - Predicción de estructura con AlphaFold
 * - AlphaMissense: Análisis de patogenicidad de variantes
 * - Visualización de pLDDT confidence scores
 */

'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AlphaFoldLabPage() {
  const [inputSequence, setInputSequence] = useState('');
  const [predictionStatus, setPredictionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const handlePredictStructure = async () => {
    if (!inputSequence.trim()) {
      alert('Por favor, ingresa una secuencia proteica');
      return;
    }

    setPredictionStatus('loading');

    try {
      // Simulación: En producción, conectaría con AlphaFold API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setPredictionStatus('success');
    } catch (error) {
      setPredictionStatus('error');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-8'>
      {/* Header */}
      <div className='mb-12'>
        <h1 className='text-5xl font-bold text-white mb-4'>🤖 Laboratorio de Proteómica Computacional</h1>
        <p className='text-lg text-slate-300'>
          Predicción de estructura con AlphaFold + Análisis de patogenicidad con AlphaMissense
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left: Input */}
        <div className='lg:col-span-1'>
          <div className='bg-slate-800/50 backdrop-blur rounded-lg p-8 border border-slate-700 sticky top-8'>
            <h3 className='text-lg font-semibold text-white mb-4'>Ingresa Secuencia</h3>

            <div className='space-y-4'>
              <div>
                <label className='text-sm text-slate-400 block mb-2'>Secuencia Proteica (FASTA)</label>
                <textarea
                  value={inputSequence}
                  onChange={(e) => setInputSequence(e.target.value)}
                  placeholder='>Protein Name
MKVLTYDDPLSGQLFEYQ...'
                  className='w-full h-32 bg-slate-900/50 border border-slate-600 rounded px-3 py-2 text-slate-100 text-sm font-mono focus:outline-none focus:border-blue-500'
                />
              </div>

              <button
                onClick={handlePredictStructure}
                disabled={predictionStatus === 'loading'}
                className={`w-full py-2 px-4 rounded font-semibold transition ${
                  predictionStatus === 'loading'
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50'
                }`}
              >
                {predictionStatus === 'loading' ? '⏳ Prediciendo...' : '🔮 Predecir Estructura'}
              </button>

              {/* Status Indicator */}
              {predictionStatus === 'success' && (
                <div className='p-3 bg-green-500/10 border border-green-500/30 rounded'>
                  <p className='text-sm text-green-300'>✅ Predicción completada</p>
                </div>
              )}
            </div>

            {/* Quick Examples */}
            <div className='mt-8 border-t border-slate-700 pt-6'>
              <h4 className='text-sm font-semibold text-slate-400 mb-3'>Ejemplos</h4>
              <button
                onClick={() =>
                  setInputSequence(`>PAH
MVHLTPEEKS`)
                }
                className='text-xs text-blue-400 hover:text-blue-300 block mb-2'
              >
                Cargar PAH (mini)
              </button>
              <button
                onClick={() =>
                  setInputSequence(`>Insulin_A_B_Chain
GIVEQCCTSICSLYQLENYCN`)
                }
                className='text-xs text-blue-400 hover:text-blue-300 block'
              >
                Cargar Insulina (mini)
              </button>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className='lg:col-span-2'>
          <Tabs defaultValue='prediction' className='w-full'>
            <TabsList className='grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700'>
              <TabsTrigger value='prediction'>Predicción AlphaFold</TabsTrigger>
              <TabsTrigger value='variants'>AlphaMissense</TabsTrigger>
            </TabsList>

            {/* Prediction Tab */}
            <TabsContent value='prediction' className='space-y-6'>
              <div className='bg-slate-800/50 backdrop-blur rounded-lg p-8 border border-slate-700'>
                <h3 className='text-xl font-bold text-white mb-6'>Estructura Predicha</h3>

                {predictionStatus === 'idle' && (
                  <div className='text-center py-16 text-slate-400'>
                    <p className='text-lg mb-2'>📝 Ingresa una secuencia para comenzar</p>
                    <p className='text-sm'>La predicción se ejecutará usando AlphaFold 3</p>
                  </div>
                )}

                {predictionStatus === 'loading' && (
                  <div className='text-center py-16'>
                    <div className='inline-block'>
                      <div className='w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin' />
                    </div>
                    <p className='text-slate-300 mt-4'>Procesando estructura...</p>
                  </div>
                )}

                {predictionStatus === 'success' && (
                  <div className='space-y-6'>
                    {/* pLDDT Chart */}
                    <div>
                      <h4 className='text-white font-semibold mb-4'>Confidence Score (pLDDT)</h4>
                      <div className='space-y-2'>
                        {[
                          { region: 'N-terminal (1-50)', score: 92, color: 'from-green-500 to-emerald-500' },
                          { region: 'Core domain (51-200)', score: 88, color: 'from-green-500 to-emerald-500' },
                          { region: 'C-terminal (201-250)', score: 45, color: 'from-yellow-500 to-orange-500' },
                        ].map((item) => (
                          <div key={item.region}>
                            <div className='flex justify-between text-sm mb-1'>
                              <span className='text-slate-300'>{item.region}</span>
                              <span className='text-white font-mono'>{item.score}/100</span>
                            </div>
                            <div className='w-full bg-slate-900/50 rounded-full h-3'>
                              <div
                                className={`bg-gradient-to-r ${item.color} h-3 rounded-full`}
                                style={{ width: `${item.score}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className='text-xs text-slate-400 mt-4'>
                        Verde (&gt;90): Modelo muy confiable | Amarillo (70-90): Confiable | Rojo (&lt;50): Flexible/Desordenado
                      </p>
                    </div>

                    {/* 3D Viewer Placeholder */}
                    <div className='border-t border-slate-700 pt-6'>
                      <h4 className='text-white font-semibold mb-4'>Visor 3D</h4>
                      <div className='w-full h-96 bg-slate-900/50 rounded border border-slate-700 flex items-center justify-center'>
                        <p className='text-slate-400 text-center'>
                          🔄 Visor Mol* en construcción<br />
                          <span className='text-xs mt-2 block'>Mostrará estructura predicha en 3D</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* AlphaMissense Tab */}
            <TabsContent value='variants' className='space-y-6'>
              <div className='bg-slate-800/50 backdrop-blur rounded-lg p-8 border border-slate-700'>
                <h3 className='text-xl font-bold text-white mb-6'>Evaluación de Variantes (AlphaMissense)</h3>

                <div className='space-y-4'>
                  {[
                    {
                      id: '1',
                      variant: 'PAH:p.Arg408Trp',
                      consequence: 'Missense',
                      pathogenicity: 'Likely Pathogenic',
                      score: 0.92,
                      description: 'Causa fenilcetonuria grave. Interfiere con interfaz catalítica.',
                    },
                    {
                      id: '2',
                      variant: 'MTHFR:p.Ala222Val (677C>T)',
                      consequence: 'Missense',
                      pathogenicity: 'Uncertain',
                      score: 0.65,
                      description: 'Termolábil, reduce actividad 70% en homocigotos.',
                    },
                    {
                      id: '3',
                      variant: 'HMG-CoA:p.Gly456Ala',
                      consequence: 'Missense',
                      pathogenicity: 'Benign',
                      score: 0.15,
                      description: 'Sustitución conservada, sin impacto.',
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedVariant(item.variant)}
                      className={`p-4 rounded border transition cursor-pointer ${
                        selectedVariant === item.variant
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-600 bg-slate-700/30 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className='flex justify-between items-start mb-2'>
                        <div>
                          <p className='font-mono text-white font-semibold'>{item.variant}</p>
                          <p className='text-xs text-slate-400 mt-1'>{item.consequence}</p>
                        </div>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                            item.pathogenicity === 'Likely Pathogenic'
                              ? 'bg-red-500/20 text-red-300'
                              : item.pathogenicity === 'Benign'
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-yellow-500/20 text-yellow-300'
                          }`}
                        >
                          {item.pathogenicity}
                        </span>
                      </div>

                      <p className='text-sm text-slate-300 mb-3'>{item.description}</p>

                      <div className='flex items-center gap-2'>
                        <div className='flex-1 bg-slate-900/50 rounded-full h-2'>
                          <div
                            className={`h-2 rounded-full transition ${
                              item.score > 0.7
                                ? 'bg-red-500'
                                : item.score > 0.5
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                            }`}
                            style={{ width: `${item.score * 100}%` }}
                          />
                        </div>
                        <span className='text-xs text-slate-400 font-mono'>{(item.score * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedVariant && (
                  <div className='mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded'>
                    <h4 className='text-white font-semibold mb-2'>📊 Detalles: {selectedVariant}</h4>
                    <p className='text-sm text-slate-300 leading-relaxed'>
                      AlphaMissense utiliza modelos de aprendizaje profundo entrenados con datos evolutivos y estructurales.
                      El score refleja la probabilidad de que la variante sea deletérea para la función proteica.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Info Cards */}
      <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-6'>
          <h4 className='text-white font-semibold mb-2'>🧬 Secuencias de Novo</h4>
          <p className='text-sm text-slate-300'>
            Carga cualquier secuencia proteica en formato FASTA y obtén predicción de estructura 3D.
          </p>
        </div>
        <div className='bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6'>
          <h4 className='text-white font-semibold mb-2'>🔮 AlphaFold 3</h4>
          <p className='text-sm text-slate-300'>
            Precisión atómica competitiva con cristalografía. Resuelve el enigma del plegamiento proteico.
          </p>
        </div>
        <div className='bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg p-6'>
          <h4 className='text-white font-semibold mb-2'>⚠️ Patogenicidad</h4>
          <p className='text-sm text-slate-300'>
            AlphaMissense predice impacto fisiológico de variantes genéticas de cambio de sentido.
          </p>
        </div>
      </div>
    </div>
  );
}
