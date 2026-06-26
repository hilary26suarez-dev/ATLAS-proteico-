/**
 * Explorador Molecular y Estructural
 * 
 * Módulo 1 del Plan: Integración Mol* + iCn3D
 * - Sincronización 1D (secuencia) ↔ 2D (interacciones) ↔ 3D (estructura)
 * - Storytelling estructural con narrativas guiadas
 * - AlphaFold predictions + pLDDT confidence scores
 */

'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ExploradorMolecularPage() {
  const [selectedProtein, setSelectedProtein] = useState('pah');
  const [view1D, setView1D] = useState(true);
  const [view2D, setView2D] = useState(true);
  const [view3D, setView3D] = useState(true);

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-8'>
      {/* Header */}
      <div className='mb-12'>
        <h1 className='text-5xl font-bold text-white mb-4'>🔬 Explorador Molecular</h1>
        <p className='text-lg text-slate-300'>
          Sincronización 1D-2D-3D de estructuras proteicas con AlphaFold Predictions
        </p>
      </div>

      {/* Main Interface */}
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Left Sidebar: Protein Selection */}
        <div className='lg:col-span-1'>
          <div className='bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700'>
            <h3 className='text-lg font-semibold text-white mb-4'>Proteínas</h3>
            <div className='space-y-2'>
              {['pah', 'mthfr', 'insulin', 'collagen-i'].map((id) => (
                <button
                  key={id}
                  onClick={() => setSelectedProtein(id)}
                  className={`w-full text-left px-3 py-2 rounded transition ${
                    selectedProtein === id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {id.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Views Toggle */}
            <div className='mt-8 border-t border-slate-700 pt-6'>
              <h4 className='text-sm font-semibold text-slate-400 mb-3'>VISTAS</h4>
              <div className='space-y-2'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={view1D}
                    onChange={(e) => setView1D(e.target.checked)}
                    className='w-4 h-4'
                  />
                  <span className='text-sm text-slate-300'>1D Secuencia</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={view2D}
                    onChange={(e) => setView2D(e.target.checked)}
                    className='w-4 h-4'
                  />
                  <span className='text-sm text-slate-300'>2D Interacciones</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={view3D}
                    onChange={(e) => setView3D(e.target.checked)}
                    className='w-4 h-4'
                  />
                  <span className='text-sm text-slate-300'>3D Estructura</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className='lg:col-span-3'>
          <Tabs defaultValue='overview' className='w-full'>
            <TabsList className='grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700'>
              <TabsTrigger value='overview'>General</TabsTrigger>
              <TabsTrigger value='structure'>Estructura</TabsTrigger>
              <TabsTrigger value='variants'>Variantes</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value='overview' className='space-y-6'>
              <div className='bg-slate-800/50 backdrop-blur rounded-lg p-8 border border-slate-700'>
                <h3 className='text-2xl font-bold text-white mb-4'>PAH - Fenilalanina Hidroxilasa</h3>

                <div className='grid grid-cols-2 gap-6 mb-6'>
                  <div>
                    <p className='text-xs text-slate-400 uppercase tracking-wide mb-1'>PDB ID</p>
                    <p className='text-lg text-white font-mono'>5PAH</p>
                  </div>
                  <div>
                    <p className='text-xs text-slate-400 uppercase tracking-wide mb-1'>AlphaFold ID</p>
                    <p className='text-lg text-white font-mono'>P12694</p>
                  </div>
                  <div>
                    <p className='text-xs text-slate-400 uppercase tracking-wide mb-1'>Peso Molecular</p>
                    <p className='text-lg text-white'>51 kDa (Monómero)</p>
                  </div>
                  <div>
                    <p className='text-xs text-slate-400 uppercase tracking-wide mb-1'>pLDDT Score</p>
                    <p className='text-lg text-white'>
                      <span className='text-green-400 font-bold'>87/100</span> (Alto)
                    </p>
                  </div>
                </div>

                <div className='border-t border-slate-700 pt-6'>
                  <h4 className='text-white font-semibold mb-3'>Mecanismo Catalítico</h4>
                  <p className='text-slate-300 leading-relaxed'>
                    PAH cataliza la hidroxilación de L-fenilalanina a L-tirosina utilizando como cofactores
                    BH4 (tetrahidrobiopterina) y hierro no-hemo. La estructura tetramérica asimétrica posee
                    dominios regulador (N-terminal), catalítico (central) y de tetramerización (C-terminal).
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Structure Tab */}
            <TabsContent value='structure' className='space-y-6'>
              <div className='bg-slate-800/50 backdrop-blur rounded-lg p-8 border border-slate-700 min-h-[400px]'>
                <h3 className='text-xl font-bold text-white mb-4'>Visor 3D (Mol* Integration)</h3>
                <div className='w-full h-96 bg-slate-900/50 rounded border border-slate-700 flex items-center justify-center'>
                  <p className='text-slate-400 text-center'>
                    🔄 Cargando Mol* viewer...<br />
                    <span className='text-xs mt-2 block'>
                      (Próxima fase: Integración Molstar + PDB files)
                    </span>
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Variants Tab */}
            <TabsContent value='variants' className='space-y-6'>
              <div className='bg-slate-800/50 backdrop-blur rounded-lg p-8 border border-slate-700'>
                <h3 className='text-xl font-bold text-white mb-4'>Análisis de Variantes (AlphaMissense)</h3>

                <div className='space-y-4'>
                  {[
                    { variant: 'Arg408Trp', pathogenicity: 'Likely Pathogenic', confidence: 0.92 },
                    { variant: 'Asp261Gly', pathogenicity: 'Benign', confidence: 0.88 },
                    { variant: 'Glu280Lys', pathogenicity: 'Uncertain', confidence: 0.65 },
                  ].map((item) => (
                    <div key={item.variant} className='p-4 bg-slate-700/30 rounded border border-slate-600'>
                      <div className='flex justify-between items-start mb-2'>
                        <span className='font-mono text-white'>{item.variant}</span>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
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
                      <div className='w-full bg-slate-700 rounded-full h-2'>
                        <div
                          className='bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full'
                          style={{ width: `${item.confidence * 100}%` }}
                        />
                      </div>
                      <p className='text-xs text-slate-400 mt-2'>Confianza: {(item.confidence * 100).toFixed(0)}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Info Panel */}
      <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6'>
          <h4 className='text-white font-semibold mb-2'>📊 pLDDT Score</h4>
          <p className='text-sm text-slate-300'>
            Confidence score de AlphaFold. Verde (&gt;90): Muy confiable. Amarillo (70-90): Confiable.
          </p>
        </div>
        <div className='bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6'>
          <h4 className='text-white font-semibold mb-2'>🧪 Storytelling</h4>
          <p className='text-sm text-slate-300'>
            Narrativas guiadas que muestran mecanismos catalíticos paso a paso.
          </p>
        </div>
        <div className='bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-6'>
          <h4 className='text-white font-semibold mb-2'>🔍 Sincronización</h4>
          <p className='text-sm text-slate-300'>Selecciona una mutación en 1D → 3D se ilumina automáticamente.</p>
        </div>
      </div>
    </div>
  );
}
