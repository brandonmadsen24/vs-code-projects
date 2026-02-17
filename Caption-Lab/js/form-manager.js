// FormManager - Collects and validates form data
class FormManager {
    constructor() {
        this.form = document.getElementById('context-form');
    }

    getFormData() {
        // Get selected platforms
        const platforms = Array.from(
            document.querySelectorAll('input[name="platform"]:checked')
        ).map(el => el.value);

        // Get selected tones
        const tones = Array.from(
            document.querySelectorAll('input[name="tone"]:checked')
        ).map(el => el.value);

        // Get selected constraints
        const constraints = Array.from(
            document.querySelectorAll('input[name="constraint"]:checked')
        ).map(el => el.value);

        // Get other form values
        const postType = document.querySelector('[name="postType"]').value;
        const series = document.querySelector('[name="series"]').value;
        const seriesDay = document.querySelector('[name="seriesDay"]').value;
        const cta = document.querySelector('[name="cta"]').value;
        const notes = document.querySelector('[name="notes"]').value;

        return {
            platforms,
            postType,
            series,
            seriesDay: seriesDay ? parseInt(seriesDay) : null,
            tones,
            cta,
            notes,
            constraints
        };
    }

    validate() {
        const data = this.getFormData();

        // At least one platform must be selected
        if (data.platforms.length === 0) {
            alert('Please select at least one platform.');
            return false;
        }

        // At least one tone must be selected
        if (data.tones.length === 0) {
            alert('Please select at least one tone.');
            return false;
        }

        return true;
    }

    reset() {
        // Reset checkboxes to defaults
        document.querySelectorAll('input[name="platform"]').forEach(el => {
            el.checked = (el.value === 'instagram' || el.value === 'tiktok');
        });

        document.querySelectorAll('input[name="tone"]').forEach(el => {
            el.checked = (el.value === 'funny');
        });

        document.querySelectorAll('input[name="constraint"]').forEach(el => {
            el.checked = (el.value === 'noCringe' || el.value === 'keepShort' || el.value === 'respectful');
        });

        // Reset selects and inputs
        document.querySelector('[name="postType"]').value = 'video';
        document.querySelector('[name="series"]').value = '';
        document.querySelector('[name="seriesDay"]').value = '';
        document.querySelector('[name="cta"]').value = '';
        document.querySelector('[name="notes"]').value = '';
    }
}
