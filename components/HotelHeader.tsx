export default function HotelHeader() {
  return (
    <header className="bg-gradient-to-r from-stone-800 to-stone-700 text-white shadow-lg">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Falcon emblem */}
          <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-stone-900 font-bold text-xl shadow-md flex-shrink-0">
            🦅
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight leading-none">
              Falcon Inn
            </h1>
            <p className="text-amber-300 text-xs mt-0.5 font-medium">
              Lundy&apos;s Lane, Niagara Falls
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <p className="text-xs text-stone-300">AI Concierge</p>
          <a
            href="tel:+19053542279"
            className="text-amber-300 text-sm font-semibold hover:text-amber-200 transition-colors"
          >
            +1 905-354-2279
          </a>
        </div>

        {/* Book Direct CTA */}
        <a
          href="https://lundyslane.com/accommodation/falcon-inn/"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-3 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-sm rounded-lg transition-colors shadow-md whitespace-nowrap"
        >
          Book Direct
        </a>
      </div>
    </header>
  );
}
