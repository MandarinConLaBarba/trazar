

exports.create = function(total, failures, skipped, errors) {

    return {
        totalTests : total,
        failures : failures,
        successes : total - failures,
        skipped : skipped,
        errors : errors
    }

};