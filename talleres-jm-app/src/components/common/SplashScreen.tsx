export default function SplashScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <img
        src="/favicon.svg"
        alt="Talleres JM"
        width={96}
        height={92}
        className="mb-5"
        style={{ filter: 'drop-shadow(0 4px 16px rgba(134,59,255,0.18))' }}
      />
      <p
        className="font-display font-bold text-xl mb-6"
        style={{ color: '#05173B' }}
      >
        Talleres JM
      </p>
      <div
        className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: '#3B82F6', borderTopColor: 'transparent' }}
      />
    </div>
  )
}
