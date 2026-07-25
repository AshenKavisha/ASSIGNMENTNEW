import React from 'react';

const STEPS = [
  { key: 'PENDING', label: 'Submitted', icon: 'bi-send' },
  { key: 'APPROVED', label: 'Approved', icon: 'bi-check-circle' },
  { key: 'PAID', label: 'Payment Confirmed', icon: 'bi-cash-coin' },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: 'bi-gear' },
  { key: 'DELIVERED', label: 'Delivered', icon: 'bi-send-check' },
  { key: 'COMPLETED', label: 'Completed', icon: 'bi-trophy' },
];

const AssignmentStatusBar = ({ status }) => {
  if (status === 'REJECTED') {
    return (
      <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 flex items-center gap-4">
        <i className="bi bi-x-circle-fill text-3xl text-red-500"></i>
        <div>
          <h5 className="font-bold text-red-700 text-lg mb-0">Assignment Rejected</h5>
          <p className="text-red-500 text-sm mb-0">This assignment was not approved by the admin.</p>
        </div>
      </div>
    );
  }

  // Treat REVISION_REQUESTED as sitting at the DELIVERED step (post-delivery loop)
  const effectiveStatus = status === 'REVISION_REQUESTED' ? 'DELIVERED' : status;
  const currentIndex = STEPS.findIndex(s => s.key === effectiveStatus);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
      <h5 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
        <i className="bi bi-signpost-split text-[#667eea]"></i> Assignment Progress
      </h5>
      <div className="flex items-center overflow-x-auto pb-2">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isFuture = idx > currentIndex;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center min-w-[90px]">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-lg shrink-0 transition-all
                    ${isDone ? 'bg-green-500 text-white' : ''}
                    ${isCurrent ? 'bg-[#667eea] text-white ring-4 ring-[#667eea]/20 scale-110' : ''}
                    ${isFuture ? 'bg-gray-200 text-gray-400' : ''}`}
                >
                  <i className={`bi ${isDone ? 'bi-check-lg' : step.icon}`}></i>
                </div>
                <span className={`text-xs font-bold mt-2 text-center leading-tight
                  ${isCurrent ? 'text-[#667eea]' : isDone ? 'text-green-600' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-1 min-w-[24px] mx-1 rounded ${idx < currentIndex ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {status === 'REVISION_REQUESTED' && (
        <div className="mt-4 bg-purple-50 text-purple-700 text-sm font-bold px-4 py-2 rounded-lg inline-flex items-center gap-2">
          <i className="bi bi-arrow-repeat"></i> Revision requested — admin is reviewing
        </div>
      )}
    </div>
  );
};

export default AssignmentStatusBar;