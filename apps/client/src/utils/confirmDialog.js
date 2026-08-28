import Swal from 'sweetalert2';

/**
 * Custom styled SweetAlert confirmation modal for deletion and sensitive actions.
 */
export const confirmDelete = async ({
  title = 'Are you sure?',
  text = 'This action cannot be undone!',
  confirmButtonText = 'Yes, Delete',
  cancelButtonText = 'Cancel',
  icon = 'warning',
} = {}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    background: 'var(--bg-card, #0f172a)',
    color: 'var(--text-primary, #f8fafc)',
    customClass: {
      popup: 'rounded-3xl border border-[var(--border-color,#334155)] shadow-2xl p-6 font-sans',
      confirmButton: 'px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow cursor-pointer',
      cancelButton: 'px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow cursor-pointer',
    },
  });

  return result.isConfirmed;
};

export default confirmDelete;
