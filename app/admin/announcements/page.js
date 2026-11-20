"use client";

import React, { useState, useEffect } from "react";
import {
  LuMegaphone,
  LuPlus,
  LuPencil,
  LuTrash2,
  LuEye,
  LuEyeOff,
  LuLoader,
  LuRadio,
} from "react-icons/lu";
import { toast } from "react-toastify";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminBadge from "../components/AdminBadge";
import ConfirmModal from "../components/ConfirmModal";
import { useAdminStore } from "@/app/stores/useAdminStore";

export default function AdminAnnouncementsPage() {
  const {
    announcements,
    isLoadingAnnouncements,
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    toggleAnnouncementPublished,
  } = useAdminStore();

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    isPublished: true,
  });

  // Delete Confirm Modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    annId: null,
    title: "",
    isDeleting: false,
  });

  const handleOpenCreate = () => {
    setEditingAnn(null);
    setFormData({
      title: "",
      message: "",
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann) => {
    setEditingAnn(ann);
    setFormData({
      title: ann.title,
      message: ann.message || ann.body || ann.description || "",
      isPublished: Boolean(ann.isPublished),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.title.trim()) {
      toast.error("Please enter an announcement title.");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("Please enter the message body.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        message: formData.message.trim(),
        isPublished: formData.isPublished,
      };

      if (editingAnn) {
        const id = editingAnn.id || editingAnn._id;
        const res = await updateAnnouncement(id, payload);
        if (res?.success) {
          toast.success("Announcement updated successfully");
          setIsModalOpen(false);
        } else {
          toast.error(res?.error || "Failed to update announcement");
        }
      } else {
        const res = await createAnnouncement(payload);
        if (res?.success) {
          toast.success("Announcement broadcast created successfully");
          setIsModalOpen(false);
        } else {
          toast.error(res?.error || "Failed to create announcement");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (ann) => {
    const id = ann.id || ann._id;
    const res = await toggleAnnouncementPublished(id);
    if (res?.success) {
      toast.success(
        `Announcement ${ann.isPublished ? "unpublished" : "published to all cafes"}`
      );
    } else {
      toast.error("Failed to toggle announcement publish status");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.annId) return;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    const res = await deleteAnnouncement(deleteModal.annId);
    setDeleteModal({ isOpen: false, annId: null, title: "", isDeleting: false });
    if (res?.success) {
      toast.success("Announcement deleted successfully");
    } else {
      toast.error(res?.error || "Failed to delete announcement");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Announcements"
        description="Broadcast notifications, platform updates, and alerts to all participating cafe dashboards."
        breadcrumbs={[{ label: "Announcements" }]}
        actions={
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 rounded-xl bg-(--mainColor) px-4 py-2 text-xs font-bold text-(--secondColor) hover:opacity-95 transition shadow-2xs"
          >
            <LuPlus className="h-4 w-4" />
            <span>Create Announcement</span>
          </button>
        }
      />

      {/* Announcements List */}
      <div className="space-y-4">
        {isLoadingAnnouncements && announcements.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-2xl border border-[#e3d7c0] bg-[#faf6ed]">
            <div className="flex flex-col items-center gap-2 text-(--mainColor)">
              <LuLoader className="h-7 w-7 animate-spin" />
              <span className="text-xs font-semibold">Loading announcements from database...</span>
            </div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-12 text-center text-(--mainColor)/60">
            <LuMegaphone className="h-9 w-9 mx-auto mb-2 text-(--mainColor)/40" />
            <p className="font-semibold text-sm text-(--mainColor)">No announcements created yet.</p>
            <p className="text-xs mt-1 text-(--mainColor)/60">
              Create an announcement to show an alert banner on all cafe owner dashboards.
            </p>
            <button
              onClick={handleOpenCreate}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-(--mainColor) px-4 py-2 text-xs font-bold text-(--secondColor)"
            >
              <LuPlus className="h-4 w-4" />
              <span>Create First Announcement</span>
            </button>
          </div>
        ) : (
          announcements.map((ann) => {
            const annId = ann.id || ann._id;
            return (
              <div
                key={annId}
                className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="font-bold text-sm text-(--mainColor)">{ann.title}</h3>
                    <AdminBadge status={ann.isPublished ? "published" : "draft"} />
                    <span className="inline-flex items-center gap-1 rounded-md bg-(--secondColor)/30 px-2 py-0.5 text-[10px] font-bold text-(--mainColor)">
                      <LuRadio className="h-3 w-3" />
                      <span>All Cafes</span>
                    </span>
                  </div>
                  <p className="text-xs text-(--mainColor)/80 leading-relaxed max-w-3xl whitespace-pre-wrap">
                    {ann.message || ann.body || ann.description}
                  </p>
                  <div className="mt-2 text-[10px] text-(--mainColor)/50 flex items-center gap-3">
                    <span>
                      Created: {ann.createdAt ? new Date(ann.createdAt).toLocaleDateString() : "Recently"}
                    </span>
                    <span>•</span>
                    <span>
                      Updated: {ann.updatedAt ? new Date(ann.updatedAt).toLocaleDateString() : "Recently"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleTogglePublish(ann)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      ann.isPublished
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                        : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    }`}
                    title={ann.isPublished ? "Unpublish from Cafes" : "Publish to All Cafes"}
                  >
                    {ann.isPublished ? (
                      <LuEyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <LuEye className="h-3.5 w-3.5" />
                    )}
                    <span>{ann.isPublished ? "Unpublish" : "Publish"}</span>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(ann)}
                    className="rounded-xl border border-[#dacdb9] bg-[#f5ecdd] p-2 text-(--mainColor) hover:bg-[#eee3d1] transition"
                    title="Edit Announcement"
                  >
                    <LuPencil className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() =>
                      setDeleteModal({
                        isOpen: true,
                        annId,
                        title: ann.title,
                        isDeleting: false,
                      })
                    }
                    className="rounded-xl p-2 text-rose-700 hover:bg-rose-100 transition"
                    title="Delete Announcement"
                  >
                    <LuTrash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-xl">
            <h3 className="font-bold text-base text-(--mainColor)">
              {editingAnn ? "Edit Announcement" : "New Cafe Announcement Broadcast"}
            </h3>
            <p className="mt-1 text-xs text-(--mainColor)/70">
              This message will be visible at the top of every cafe staff dashboard.
            </p>
            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-(--mainColor) block mb-1">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Scheduled System Upgrade or New Loyalty Feature"
                  className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div>
                <label className="font-semibold text-(--mainColor) block mb-1">
                  Message Body <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Enter the full announcement text that cafe owners will read..."
                  className="w-full rounded-xl border border-[#dacdb9] bg-[#f5ecdd] p-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) =>
                      setFormData({ ...formData, isPublished: e.target.checked })
                    }
                    className="rounded accent-(--mainColor) h-4 w-4"
                  />
                  <span className="font-semibold text-(--mainColor)">
                    Publish immediately to all cafe dashboards
                  </span>
                </label>
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2 border-t border-[#ebdcc8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-[#dacdb9] px-4 py-2 font-bold text-(--mainColor)"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-(--mainColor) px-4 py-2 font-bold text-(--secondColor) hover:opacity-95 transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting && <LuLoader className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingAnn ? "Save Changes" : "Broadcast Announcement"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={`Delete "${deleteModal.title}"?`}
        description="This will permanently delete the announcement. It will immediately disappear from all cafe dashboards."
        confirmLabel="Yes, Delete"
        confirmVariant="danger"
        isLoading={deleteModal.isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, annId: null, title: "", isDeleting: false })}
      />
    </div>
  );
}
