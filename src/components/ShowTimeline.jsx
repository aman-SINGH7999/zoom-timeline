import React, {
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
  useEffect,
} from 'react';
import './ShowTimeline.css';

export default function ShowTimeline({ dateArray }) {
  const [zoomLevel, setZoomLevel] = useState(100);
  let colorList = ["#2E7D32", "#66BB6A", "#A5D6A7", "#9E9E9E", "#FFEB3B","#BDBDBD", "#FFF59D",]
  const containerRef = useRef(null);

  // Refs to keep latest values without re-creating listeners
  const zoomRef = useRef(zoomLevel);
  const rafRef = useRef(null);
  const pendingScrollRef = useRef(null); // { newZoom, focalPoint }

  // Sync ref with state
  useLayoutEffect(() => {
    zoomRef.current = zoomLevel;
  }, [zoomLevel]);

  // Adjust scroll to keep focal point under mouse
  const applyScrollCorrection = useCallback(() => {
    const container = containerRef.current;
    const pending = pendingScrollRef.current;
    if (!container || !pending) return;

    const { newZoom, focalPoint } = pending;
    const oldZoom = zoomRef.current;
    const scrollLeftBefore = container.scrollLeft;

    // Scale scroll position so focal point stays fixed
    const newScrollLeft =
      (scrollLeftBefore + focalPoint) * (newZoom / oldZoom) - focalPoint;

    // Clamp to valid scroll range
    const maxScroll = container.scrollWidth - container.clientWidth;
    container.scrollLeft = Math.max(0, Math.min(newScrollLeft, maxScroll));

    pendingScrollRef.current = null; // Clear after use
  }, []);

  // Handle wheel zoom
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();

      const rect = container.getBoundingClientRect();
      const focalPoint = e.clientX - rect.left; // mouse x inside container

      // Use exponential scale for smooth zoom
      const delta = e.deltaY;
      const scaleFactor = Math.exp(-delta * 0.002); // smooth exponential factor
      const oldZoom = zoomRef.current;
      let newZoom = oldZoom * scaleFactor;

      // Clamp zoom
      newZoom = Math.max(100, Math.min(newZoom, 12000));

      // Schedule zoom update and scroll correction
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        setZoomLevel(newZoom);
        pendingScrollRef.current = { newZoom, focalPoint };
        applyScrollCorrection();
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [applyScrollCorrection]); // No zoomLevel dependency!

  return (
    <div>
      <div className="show-dates" ref={containerRef}>
        {dateArray.length > 0 &&
          dateArray.map((date, index) => (
            <div
              key={index}
              className="timeline-date"
              style={{
                minWidth: `${zoomLevel}px`,
                // transition: 'width 0.1s ease-out',
                // Avoid transition on min-width; use width if possible
                transition: 'none', // better: animate width or use transform
              }}
            >
              <div className="date-time-label">
                <div className="date-label" style={{left:`${ zoomLevel > 200 ? "-30px" : "-15px"}`}}>
                  {zoomLevel > 200 && <div>00:00</div>}
                  {date.day.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    ...(zoomLevel > 200 && { year: 'numeric' })
                  })}
                </div>
                <div className="time-label">
                <div></div>
                  {zoomLevel > 1200 && <div>01:00</div>}
                  {zoomLevel > 1200 && <div>02:00</div>}
                  {zoomLevel > 800 && <div>03:00</div>}
                  {zoomLevel > 1200 && <div>04:00</div>}
                  {zoomLevel > 1200 && <div>05:00</div>}
                  {zoomLevel > 400 && <div>06:00</div>}
                  {zoomLevel > 1200 && <div>07:00</div>}
                  {zoomLevel > 1200 && <div>08:00</div>}
                  {zoomLevel > 800 && <div>09:00</div>}
                  {zoomLevel > 1200 && <div>10:00</div>}
                  {zoomLevel > 1200 && <div>11:00</div>}
                  {zoomLevel > 200 && <div>12:00</div>}
                  {zoomLevel > 1200 && <div>13:00</div>}
                  {zoomLevel > 1200 && <div>14:00</div>}
                  {zoomLevel > 800 && <div>15:00</div>}
                  {zoomLevel > 1200 && <div>16:00</div>}
                  {zoomLevel > 1200 && <div>17:00</div>}
                  {zoomLevel > 400 && <div>18:00</div>}
                  {zoomLevel > 1200 && <div>19:00</div>}
                  {zoomLevel > 1200 && <div>20:00</div>}
                  {zoomLevel > 800 && <div>21:00</div>}
                  {zoomLevel > 1200 && <div>22:00</div>}
                  {zoomLevel > 1200 && <div>23:00</div>}
                  <div></div>
                </div>
              </div>
              <div className="date-bar">
                {
                  date.time.map((t, i)=>{
                    return <div className="time-bar" style={{backgroundColor:`${colorList[t]}`}}></div>
                  })
                }

              </div>
            </div>
          ))}
      </div>
    </div>
  );
}