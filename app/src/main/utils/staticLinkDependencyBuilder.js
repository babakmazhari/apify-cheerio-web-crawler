exports.build = ($) => {
    const staticLinks = [];
    $('a').each(function () {
        const link = $(this).attr('href');
        if (link) 
        {
            staticLinks.push(link);
        }
    })
    return staticLinks;
}