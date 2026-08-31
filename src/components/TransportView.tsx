import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Navigation, 
  AlertCircle, 
  Clock, 
  Users, 
  Radio, 
  RefreshCw,
  Search,
  CheckCircle2
} from 'lucide-react';
import { BusRoute, Student, Role } from '../types';

interface TransportViewProps {
  busRoutes: BusRoute[];
  students: Student[];
  onSelectStudent: (student: Student) => void;
  currentRole: Role;
}

export const TransportView: React.FC<TransportViewProps> = ({
  busRoutes,
  students,
  onSelectStudent,
  currentRole
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(busRoutes[0]?.id || '');
  const [routesState, setRoutesState] = useState<BusRoute[]>(busRoutes);
  const [isSimulatingGps, setIsSimulatingGps] = useState<boolean>(true);

  const selectedRoute = routesState.find(r => r.id === selectedRouteId) || routesState[0];

  // Students on this route
  const routeStudents = students.filter(s => {
    if (!selectedRoute) return false;
    const zoneKeyword = selectedRoute.routeNo.split('(')[1]?.replace(')', '') || '';
    return s.bhopalZone.toLowerCase().includes(zoneKeyword.toLowerCase()) ||
           selectedRoute.stops.some(st => s.busStop?.toLowerCase().includes(st.name.toLowerCase()));
  });

  // Simulated GPS Telemetry heartbeat
  useEffect(() => {
    if (!isSimulatingGps) return;

    const interval = setInterval(() => {
      setRoutesState(prev => prev.map(route => {
        // randomly step stop or alter speed
        const speedDelta = Math.floor(Math.random() * 5) - 2;
        const newSpeed = Math.max(15, Math.min(55, route.gpsSpeedKmH + speedDelta));
        return {
          ...route,
          gpsSpeedKmH: newSpeed
        };
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulatingGps]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">Bhopal Transport Fleet & GPS Tracking</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              8 Active Routes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time GPS telemetry across Bhopal zones, driver speed monitoring & student safety logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulatingGps(!isSimulatingGps)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              isSimulatingGps
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isSimulatingGps ? 'animate-pulse text-emerald-600' : ''}`} />
            <span>{isSimulatingGps ? 'Live GPS Feed Active' : 'GPS Simulation Paused'}</span>
          </button>
        </div>
      </div>

      {/* Routes Grid Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {routesState.map(route => {
          const isSelected = route.id === selectedRouteId;

          return (
            <div
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-900 text-white border-indigo-600 shadow-md shadow-indigo-900/20'
                  : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-900 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                    isSelected ? 'bg-indigo-800 text-indigo-200' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {route.busRegistrationNo}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    route.currentLiveStatus === 'On Time'
                      ? isSelected ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800'
                      : isSelected ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {route.currentLiveStatus}
                  </span>
                </div>

                <h3 className="text-xs font-bold font-outfit truncate">{route.routeNo}</h3>
                <div className={`text-[11px] mt-1 flex items-center gap-1 ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{route.currentLocationName}</span>
                </div>
              </div>

              <div className={`mt-3 pt-2.5 border-t text-[10px] flex items-center justify-between font-mono ${
                isSelected ? 'border-indigo-800/80 text-indigo-300' : 'border-slate-100 text-slate-400'
              }`}>
                <span>{route.driverName.split(' ')[0]} (Driver)</span>
                <span className="font-bold">{route.gpsSpeedKmH} km/h</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Route Radar & Stop Timeline */}
      {selectedRoute && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Interactive Stop Timeline & Vehicle Spec */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900 font-outfit">
                      {selectedRoute.routeNo}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono text-xs font-bold">
                      {selectedRoute.busRegistrationNo}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Seating Capacity: {selectedRoute.capacity} Seats • CCTV & GPS Speed Governor Equipped
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Current Speed</div>
                    <div className="text-base font-bold font-mono text-indigo-600">
                      {selectedRoute.gpsSpeedKmH} km/h
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <Navigation className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Bhopal Route Stops Timeline */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-4">
                  Bhopal Route Stop Sequence & Pickup Timings
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
                  {selectedRoute.stops.map((stop, idx) => {
                    const isCurrent = stop.name === selectedRoute.currentLocationName;
                    const isLast = idx === selectedRoute.stops.length - 1;

                    return (
                      <div key={idx} className="relative group">
                        {/* Dot indicator */}
                        <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          isCurrent
                            ? 'bg-emerald-500 border-emerald-300 ring-4 ring-emerald-100 animate-pulse'
                            : isLast
                            ? 'bg-indigo-600 border-indigo-200'
                            : 'bg-white border-indigo-400 group-hover:bg-indigo-50'
                        }`} />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-900">{stop.name}</span>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                                  Current Bus Location
                                </span>
                              )}
                              {isLast && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-100 text-indigo-800">
                                  Destination
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span>Drop: {stop.dropTime}</span>
                              <span>•</span>
                              <span>Boarding: {stop.studentCount} Students</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-mono text-xs font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                              Pickup: {stop.pickupTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Crew & Student Boarding List */}
          <div className="space-y-6">
            {/* Crew Details Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                Assigned Bus Crew
              </h3>

              {/* Driver */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Senior Bus Driver</span>
                  <strong className="text-xs text-slate-900">{selectedRoute.driverName}</strong>
                  <div className="text-[10px] text-emerald-600 font-medium">Heavy Vehicle Licensed</div>
                </div>
                <a
                  href={`tel:${selectedRoute.driverPhone}`}
                  className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
                  title="Call Driver"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              {/* Attendant */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Bus Attendant / Conductor</span>
                  <strong className="text-xs text-slate-900">{selectedRoute.attendantName}</strong>
                  <div className="text-[10px] text-slate-500">Student Safety & Boarding</div>
                </div>
                <a
                  href={`tel:${selectedRoute.attendantPhone}`}
                  className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
                  title="Call Attendant"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Students Boarding This Route */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Boarding Manifest ({routeStudents.length})
                </h3>
                <span className="text-[10px] text-slate-400">Click to view</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
                {routeStudents.length === 0 ? (
                  <div className="py-4 text-center text-xs text-slate-400">
                    No students currently mapped to this specific route.
                  </div>
                ) : (
                  routeStudents.map(st => (
                    <div
                      key={st.id}
                      onClick={() => onSelectStudent(st)}
                      className="py-2.5 px-2 -mx-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center justify-between text-xs group"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={st.avatarUrl}
                          alt={st.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-indigo-600">
                            {st.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Class {st.grade}-{st.section} • Stop: {st.busStop}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-600 font-bold">
                        {st.admissionNo}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
