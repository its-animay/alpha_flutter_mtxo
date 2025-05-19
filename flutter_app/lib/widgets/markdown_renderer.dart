import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:mtxo_labs_edtech/theme/app_theme.dart';

class MarkdownRenderer extends StatelessWidget {
  final String data;
  final bool selectable;
  final TextStyle? titleStyle;
  final TextStyle? bodyStyle;
  final TextStyle? codeStyle;
  final EdgeInsetsGeometry padding;

  const MarkdownRenderer({
    required this.data,
    this.selectable = false,
    this.titleStyle,
    this.bodyStyle,
    this.codeStyle,
    this.padding = EdgeInsets.zero,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    // Default text styles
    final defaultTitleStyle = titleStyle ?? 
        AppTextStyles.heading4.copyWith(color: theme.colorScheme.onSurface);
    final defaultBodyStyle = bodyStyle ?? 
        AppTextStyles.bodyLarge.copyWith(color: theme.colorScheme.onSurface);
    final defaultCodeStyle = codeStyle ?? 
        AppTextStyles.bodyMedium.copyWith(
          fontFamily: 'monospace',
          color: isDark ? Colors.lightBlueAccent : Colors.indigo,
        );

    return Padding(
      padding: padding,
      child: selectable
          ? SelectableMarkdown(
              data: data,
              onTapLink: (text, href, title) {
                _launchUrl(href);
              },
              styleSheet: _buildStyleSheet(
                theme,
                defaultTitleStyle,
                defaultBodyStyle,
                defaultCodeStyle,
              ),
            )
          : Markdown(
              data: data,
              onTapLink: (text, href, title) {
                _launchUrl(href);
              },
              styleSheet: _buildStyleSheet(
                theme,
                defaultTitleStyle,
                defaultBodyStyle,
                defaultCodeStyle,
              ),
            ),
    );
  }

  MarkdownStyleSheet _buildStyleSheet(
    ThemeData theme,
    TextStyle titleStyle,
    TextStyle bodyStyle,
    TextStyle codeStyle,
  ) {
    final isDark = theme.brightness == Brightness.dark;

    return MarkdownStyleSheet(
      // Text styles
      h1: titleStyle.copyWith(fontSize: 26, fontWeight: FontWeight.bold),
      h2: titleStyle.copyWith(fontSize: 24, fontWeight: FontWeight.bold),
      h3: titleStyle.copyWith(fontSize: 20, fontWeight: FontWeight.bold),
      h4: titleStyle.copyWith(fontSize: 18, fontWeight: FontWeight.bold),
      h5: titleStyle.copyWith(fontSize: 16, fontWeight: FontWeight.bold),
      h6: titleStyle.copyWith(fontSize: 14, fontWeight: FontWeight.bold),
      p: bodyStyle,
      strong: bodyStyle.copyWith(fontWeight: FontWeight.bold),
      em: bodyStyle.copyWith(fontStyle: FontStyle.italic),
      del: bodyStyle.copyWith(decoration: TextDecoration.lineThrough),
      
      // Link styles
      a: bodyStyle.copyWith(
        color: theme.colorScheme.primary,
        decoration: TextDecoration.underline,
      ),
      
      // List styles
      listBullet: bodyStyle,
      
      // Code styles
      code: codeStyle,
      codeblockDecoration: BoxDecoration(
        color: isDark ? Colors.grey[900] : Colors.grey[100],
        borderRadius: BorderRadius.circular(8.0),
        border: Border.all(
          color: isDark ? Colors.grey[800]! : Colors.grey[300]!,
        ),
      ),
      
      // Block quote styles
      blockquote: bodyStyle.copyWith(
        color: theme.colorScheme.onSurface.withOpacity(0.7),
        fontStyle: FontStyle.italic,
      ),
      blockquoteDecoration: BoxDecoration(
        border: Border(
          left: BorderSide(
            color: theme.colorScheme.primary,
            width: 4.0,
          ),
        ),
      ),
      
      // Table styles
      tableHead: bodyStyle.copyWith(fontWeight: FontWeight.bold),
      tableBorder: TableBorder.all(
        color: theme.dividerColor,
        width: 1.0,
      ),
      tableBody: bodyStyle,
      
      // Horizontal rule style
      horizontalRuleDecoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: theme.dividerColor,
            width: 1.0,
          ),
        ),
      ),
    );
  }

  Future<void> _launchUrl(String? url) async {
    if (url == null) return;
    
    final Uri uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }
}